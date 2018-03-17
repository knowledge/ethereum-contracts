pragma solidity ^0.4.18;

import { Ownable } from './Ownable.sol';


contract UpgradableStorage is Ownable {

  // Address of the current implementation
  address internal _implementation;

  event NewImplementation(address implementation);

  /**
  * @dev Tells the address of the current implementation
  * @return address of the current implementation
  */
  function implementation() public view returns (address) {
    return _implementation;
  }
}
