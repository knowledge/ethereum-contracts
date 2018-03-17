pragma solidity ^0.4.18;

import { PayableTokenLegacy } from './PayableToken.sol';
import { UpgradeableTokenLegacy } from './UpgradableToken.sol';


/**
 * Knowledge Contract (KNW)
 * Upgradable Standard ECR20 Token
 */
contract KnowledgeLegacy is PayableTokenLegacy, UpgradeableTokenLegacy {
  string public constant name = 'Knowledge';
  string public constant symbol = 'KNW';
  uint8 public constant decimals = 8;

  /** 150,000,000.00000000 KNW tokens */
  uint256 public constant INITIAL_SUPPLY = 15000000000000000;

  function KnowledgeLegacy() public {
    totalSupply = INITIAL_SUPPLY;
  }
}
