pragma solidity ^0.4.18;

import { PayableToken } from './PayableToken.sol';
import { UpgradeableToken } from './UpgradableToken.sol';


/**
 * Knowledge Contract (KNW)
 * Upgradable Standard ECR20 Token
 */
contract Knowledge is PayableToken, UpgradeableToken {
  string public constant name = 'Knowledge';
  string public constant symbol = 'KNW';
  uint8 public constant decimals = 8;

  /** 125,000,000.00000000 KNW tokens */
  uint256 public constant INITIAL_SUPPLY = 12500000000000000;

  function Knowledge() UpgradeableToken(msg.sender) public {
    totalSupply = INITIAL_SUPPLY;

    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }
}
