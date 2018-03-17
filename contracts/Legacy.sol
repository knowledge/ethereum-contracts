pragma solidity ^0.4.18;

import { Base } from './Base.sol';
import { SafeMath } from './utils/SafeMath.sol';


/**
 * A token upgrade mechanism where users can upgrade tokens
 * to the next smart contract revision.
 *
 * First envisioned by Golem and Lunyr projects.
 */
contract Legacy is Base {
  using SafeMath for uint256;

  /** The contract from which we upgrade */
  Legacy public prevContract;

  /**
   * Somebody has upgraded some of their tokens.
   */
  event UpgradeFrom(address indexed _from, address indexed _to, uint256 _value);

  /**
   * Previous contract available.
   */
  event PrevContractSet(address contractAddress);

  modifier fromPrevContract() {
    require(msg.sender == address(prevContract));
    _;
  }

  function upgradeFrom(address holder, uint256 value) fromPrevContract public returns (bool) {
    balances[holder] = value;
    Transfer(address(0), holder, value);
    UpgradeFrom(address(prevContract), holder, value);

    return true;
  }

  function setPrevContract(address contractAddress) onlyOwner public returns (bool) {
    require(contractAddress != 0x0);
    prevContract = Legacy(contractAddress);
    PrevContractSet(contractAddress);

    return true;
  }
}
