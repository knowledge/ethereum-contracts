pragma solidity ^0.4.18;


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
  function isUpgradeAgent() public pure returns (bool) {
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
