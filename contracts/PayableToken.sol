pragma solidity ^0.4.18;

import { ERC20Token } from './ERC20Token.sol';


/**
 * Payable token is meant to execute the `transfer` method of the ERC20 Token
 * and log a Pay message with a reference message to bind the payment to an
 * order id or some other identifier
 */
contract PayableToken is ERC20Token {
  struct PaymentRequest {
    uint256 fee;
    uint256 value;
    address seller;
  }

  mapping (address => mapping(string => PaymentRequest)) private pendingPayments;

  event Pay(
    address indexed from,
    address indexed seller,
    address indexed store,
    uint256 value,
    uint256 fee,
    string ref
  );

  function requestPayment(uint256 value, uint256 fee, string ref, address to) public {
    pendingPayments[msg.sender][ref] = PaymentRequest(fee, value, to);
  }

  function cancelPayment(string ref) public {
    delete pendingPayments[msg.sender][ref];
  }

  function paymentInfo(address store, string ref) public view returns (uint256 value, uint256 fee, address seller) {
    PaymentRequest memory paymentRequest = pendingPayments[store][ref];
    value = paymentRequest.value;
    fee = paymentRequest.fee;
    seller = paymentRequest.seller;
  }

  function pay(address store, string ref) public returns (bool) {
    PaymentRequest memory paymentRequest = pendingPayments[store][ref];

    if (paymentRequest.fee > 0) {
      assert(transfer(store, paymentRequest.fee));
    }

    assert(transfer(paymentRequest.seller, paymentRequest.value));

    Pay(msg.sender, paymentRequest.seller, store, paymentRequest.value, paymentRequest.fee, ref);
    delete pendingPayments[store][ref];

    return true;
  }
}
