pragma solidity ^0.4.18;

import { UpgradeableToken } from './Upgradable.sol';

/**
 * Knowledge Contract (KNW)
 * Upgradable Standard ECR20 Token
 */
contract Knowledge is UpgradeableToken {
  string public constant name = 'Knowledge';
  string public constant symbol = 'KNW';
  uint8 public constant decimals = 8;

  /** 125,000,000 KNW tokens */
  uint256 public constant INITIAL_SUPPLY = 125000000 * (10 ** uint256(decimals));

  function Knowledge() UpgradeableToken(msg.sender) public {
    totalSupply = INITIAL_SUPPLY;

    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }
}
