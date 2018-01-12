pragma solidity ^0.4.18;

import { ERC20Token } from './ERC20Token.sol';
import { Ownable } from './utils/Ownable.sol';


/**
 * Payable token is meant to execute the `transfer` method of the ERC20 Token
 * and log a Pay message with a reference message to bind the payment to an
 * order id or some other identifier
 */
contract PayableToken is ERC20Token, Ownable {
  mapping(uint256 => address) public stores;

  event Pay(address indexed store, address indexed seller, address indexed buyer, uint256 value, string ref);

  event NewStore(uint256 id, address store);

  function addStore(uint256 id, address store) public onlyOwner {
    stores[id] = store;
    NewStore(id, store);
  }

  function verifySignature(
    bytes32 h,
    bytes32 r,
    bytes32 s,
    uint8 v,
    address seller,
    address store,
    uint256 value,
    uint256 fee,
    string ref
  )
    pure
    private
    returns (bool)
  {
    bytes memory prefix = '\x19Ethereum Signed Message:\n32';
    bytes32 ph = keccak256(prefix, h);
    address signer = ecrecover(ph, v, r, s);
    assert(signer == store);

    bytes32 proof = keccak256(seller, store, value, fee, ref);
    assert(proof == h);

    return true;
  }

  function pay(
    bytes32 h,
    bytes32 r,
    bytes32 s,
    uint8 v,
    address seller,
    uint256 storeId,
    uint256 value,
    uint256 fee,
    string ref
  )
    public
    returns (bool)
  {
    address store = stores[storeId];
    assert(store != 0x0);

    verifySignature(h, r, s, v, seller, store, value, fee, ref);

    if (fee > 0) {
      assert(transfer(store, fee));
    }

    assert(transfer(seller, value));

    Pay(store, seller, msg.sender, value, ref);

    return true;
  }
}
