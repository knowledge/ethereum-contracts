pragma solidity ^0.4.18;

import { StandardToken } from 'zeppelin/contracts/token/StandardToken.sol';
import { SafeMath } from 'zeppelin/contracts/math/SafeMath.sol';

/**
 * Upgrade agent interface inspired by Lunyr.
 *
 * Upgrade agent transfers tokens to a new version of a token contract.
 * Upgrade agent can be set on a token by the upgrade master.
 *
 * Steps are
 * - Upgradeabletoken.upgradeMaster calls UpgradeableToken.setUpgradeAgent()
 * - Individual token holders can now call UpgradeableToken.upgrade()
 *   -> This results to call UpgradeAgent.upgradeFrom() that issues new tokens
 *   -> UpgradeableToken.upgrade() reduces the original total supply based on amount of upgraded tokens
 *
 * Upgrade agent itself can be the token contract, or just a middle man contract doing the heavy lifting.
 */
contract UpgradeAgent {

  uint public originalSupply;

  /** Interface marker */
  function isUpgradeAgent() public constant returns (bool) {
    return true;
  }

  /**
   * Upgrade amount of tokens to a new version.
   *
   * Only callable by UpgradeableToken.
   *
   * @param _tokenHolder Address that wants to upgrade its tokens
   * @param _amount Number of tokens to upgrade. The address may consider to hold back some amount of tokens in the old version.
   */
  function upgradeFrom(address _tokenHolder, uint256 _amount) external;
}

/**
 * A token upgrade mechanism where users can opt-in amount of tokens to the next smart contract revision.
 *
 * First envisioned by Golem and Lunyr projects.
 */
contract UpgradeableToken is StandardToken {

  /** Contract / person who can set the upgrade path. This can be the same as team multisig wallet, as what it is with its default value. */
  address public upgradeMaster;

  /** The next contract where the tokens will be migrated. */
  UpgradeAgent public upgradeAgent;

  /** How many tokens we have upgraded by now. */
  uint256 public totalUpgraded;

  /**
   * Upgrade states.
   *
   * - NotAllowed: The child contract has not reached a condition where the upgrade can bgun
   * - WaitingForAgent: Token allows upgrade, but we don't have a new agent yet
   * - ReadyToUpgrade: The agent is set, but not a single token has been upgraded yet
   * - Upgrading: Upgrade agent is set and the balance holders can upgrade their tokens
   *
   */
  enum UpgradeState {Unknown, NotAllowed, WaitingForAgent, ReadyToUpgrade, Upgrading}

  /**
   * Somebody has upgraded some of his tokens.
   */
  event Upgrade(address indexed _from, address indexed _to, uint256 _value);

  /**
   * New upgrade agent available.
   */
  event UpgradeAgentSet(address agent);

  /**
   * Upgrade master updated.
   */
  event NewUpgradeMaster(address upgradeMaster);

  /**
   * Do not allow construction without upgrade master set.
   */
  function UpgradeableToken(address _upgradeMaster) public {
    upgradeMaster = _upgradeMaster;
    NewUpgradeMaster(upgradeMaster);
  }

  /**
   * Allow the token holder to upgrade some of their tokens to a new contract.
   */
  function upgrade(uint256 value) public {
    UpgradeState state = getUpgradeState();
    require(state == UpgradeState.ReadyToUpgrade || state == UpgradeState.Upgrading);
    // Validate input value.
    require(value != 0);

    balances[msg.sender] = SafeMath.sub(balances[msg.sender], value);

    // Take tokens out from circulation
    totalSupply = SafeMath.sub(totalSupply, value);
    totalUpgraded = SafeMath.add(totalUpgraded, value);

    // Upgrade agent reissues the tokens
    upgradeAgent.upgradeFrom(msg.sender, value);
    Upgrade(msg.sender, upgradeAgent, value);
  }

  /**
   * Set an upgrade agent that handles
   */
  function setUpgradeAgent(address agent) external {
    require(canUpgrade());

    require(agent != 0x0);
    // Only a master can designate the next agent
    require(msg.sender == upgradeMaster);
    // Upgrade has already begun for an agent
    require(getUpgradeState() != UpgradeState.Upgrading);

    upgradeAgent = UpgradeAgent(agent);

    // Bad interface
    require(upgradeAgent.isUpgradeAgent());
    // Make sure that token supplies match in source and target
    require(upgradeAgent.originalSupply() == totalSupply);

    UpgradeAgentSet(upgradeAgent);
  }

  /**
   * Get the state of the token upgrade.
   */
  function getUpgradeState() public constant returns(UpgradeState) {
    if (!canUpgrade()) {
      return UpgradeState.NotAllowed;
    } else if (address(upgradeAgent) == 0x00) {
      return UpgradeState.WaitingForAgent;
    } else if (totalUpgraded == 0) {
      return UpgradeState.ReadyToUpgrade;
    } else {
      return UpgradeState.Upgrading;
    }
  }

  /**
   * Change the upgrade master.
   *
   * This allows us to set a new owner for the upgrade mechanism.
   */
  function setUpgradeMaster(address master) public {
    require(master != 0x0);
    require(msg.sender == upgradeMaster);
    upgradeMaster = master;
    NewUpgradeMaster(upgradeMaster);
  }

  /**
   * Child contract can enable to provide the condition when the upgrade can begun.
   */
  function canUpgrade() public constant returns(bool) {
    return true;
  }
}