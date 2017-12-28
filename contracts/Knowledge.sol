pragma solidity ^0.4.18;

import { Payment } from './Payment.sol';
import { UpgradeableToken } from './Upgradable.sol';


/**
 * Knowledge Contract (KNW)
 * Upgradable Standard ECR20 Token
 */
contract Knowledge is Payment, UpgradeableToken {
  string public name = 'Knowledge';
  string public symbol = 'KNW';
  uint8 public decimals = 8;

  /** 125,000,000 KNW tokens */
  uint256 public constant INITIAL_SUPPLY = 125000000 * (10 ** uint256(decimals));

  function Knowledge() UpgradeableToken(msg.sender) public {
    totalSupply = INITIAL_SUPPLY;

    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }
}
