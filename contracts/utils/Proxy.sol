pragma solidity ^0.4.18;


/**
 * @title Proxy
 * @dev Gives the possibility to delegate any call to a foreign implementation.
 */
contract Proxy {
  function implementation() public view returns (address);

  /**
  * @dev Fallback function allowing to perform a delegatecall to the given implementation.
  * This function will return whatever the implementation call returns
  */
  function () payable public {
    address impl = implementation();
    require(impl != address(0));
    bytes memory data = msg.data;

    assembly {
      let result := delegatecall(gas, impl, add(data, 0x20), mload(data), 0, 0)
      let size := returndatasize

      let ptr := mload(0x40)
      returndatacopy(ptr, 0, size)

      switch result
      case 0 { revert(ptr, size) }
      default { return(ptr, size) }
    }
  }
}
