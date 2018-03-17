pragma solidity ^0.4.18;

import { UpgradableStorage } from './UpgradableStorage.sol';


/**
 * @title Upgradable
 * @dev This contract represents an upgradable contract
 */
contract Upgradable is UpgradableStorage {
  function initialize() public payable { }
}
