pragma solidity ^0.4.18;

import { ERC20Token } from './utils/ERC20Token.sol';
import { Upgradable } from './utils/Upgradable.sol';


/**
 * Base Contract (KNW)
 * Upgradable Standard ECR20 Token
 */
contract Base is Upgradable, ERC20Token {
  function name() pure public returns (string) {
    return 'Knowledge.io';
  }

  function symbol() pure public returns (string) {
    return 'KNW';
  }

  function decimals() pure public returns (uint8) {
    return 8;
  }

  function INITIAL_SUPPLY() pure public returns (uint) {
    /** 150,000,000.00000000 KNW tokens */
    return 15000000000000000;
  }

  function totalSupply() view public returns (uint) {
    return INITIAL_SUPPLY();
  }
}
