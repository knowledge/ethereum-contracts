pragma solidity ^0.4.18;

import { Proxy } from './utils/Proxy.sol';
import { Upgradable } from './utils/Upgradable.sol';
import { UpgradableStorage } from './utils/UpgradableStorage.sol';


contract KnowledgeProxy is Proxy, UpgradableStorage {
  /**
  * @dev Upgrades the implementation to the requested version
  */
  function upgradeTo(address imp) onlyOwner public payable {
    _implementation = imp;
    Upgradable(this).initialize.value(msg.value)();

    NewImplementation(imp);
  }
}
