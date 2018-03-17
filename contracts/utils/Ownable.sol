pragma solidity ^0.4.18;


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address[] public owners;

  event OwnerAdded(address indexed authorizer, address indexed newOwner, uint256 index);

  event OwnerRemoved(address indexed authorizer, address indexed oldOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owners.push(msg.sender);
    OwnerAdded(0x0, msg.sender, 0);
  }

  /**
   * @dev Throws if called by any account other than one owner.
   */
  modifier onlyOwner() {
    bool isOwner = false;

    for (uint256 i = 0; i < owners.length; i++) {
      if (msg.sender == owners[i]) {
        isOwner = true;
        break;
      }
    }

    require(isOwner);
    _;
  }

  /**
   * @dev Allows one of the current owners to add a new owner
   * @param newOwner The address give ownership to.
   */
  function addOwner(address newOwner) onlyOwner public {
    require(newOwner != address(0));
    uint256 i = owners.push(newOwner) - 1;
    OwnerAdded(msg.sender, newOwner, i);
  }

  /**
   * @dev Allows one of the owners to remove other owner
   */
  function removeOwner(uint256 index) onlyOwner public {
    address owner = owners[index];
    owners[index] = owners[owners.length - 1];
    delete owners[owners.length - 1];
    OwnerRemoved(msg.sender, owner);
  }

  function ownersCount() constant public returns (uint256) {
    return owners.length;
  }
}
