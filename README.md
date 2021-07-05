# Solidity Game - Preservation Attack

_Inspired by OpenZeppelin's [Ethernaut](https://ethernaut.openzeppelin.com), Preservation Level_

⚠️Do not try on mainnet!

## Task

This contract utilizes a library to store two different times for two different timezones. The constructor creates two instances of the library for each time to be stored.
The goal of this game is for you to claim ownership of the instance you are given.

_Hint:_

1. Look into Solidity's documentation on the `delegatecall` low level function, how it works, how it can be used to delegate operations to on-chain. libraries, and what implications it has on execution scope.
2. Understanding what it means for `delegatecall` to be context-preserving.
3. Understanding how storage variables are stored and accessed.
4. Understanding how casting works between different data types.

## What will you learn?

1. `delegatecall` low level operation
2. `library` vs `contract`
3. [Layout of State Variables in Storage](https://docs.soliditylang.org/en/v0.8.6/internals/layout_in_storage.html)

## What is the most difficult challenge?

This game requires you to combine knowledge from [Delegation Attack](https://github.com/maAPPsDEV/delegation-attack) and [Privacy Attack](https://github.com/maAPPsDEV/privacy-attack) to claim ownership of the contract.

### Delegation Attack 🤗

![preservation1](https://user-images.githubusercontent.com/78368735/124507925-d39f4800-dd9c-11eb-9d4c-a29b6214b41f.jpeg)

- `Delegate` call is a special, low level function call intended to invoke functions from another, often library, contract.
- If Contract A makes a `delegatecall` to Contract B, it allows Contract B to freely mutate its storage A, given Contract B’s relative storage reference pointers.

> _**Hint:** if Contract A invokes Contract B, and you can control Contract B, you can easily mutate the state of Contract A._

### Privacy Attack 🙄

![preservation2](https://user-images.githubusercontent.com/78368735/124508000-fdf10580-dd9c-11eb-9646-428f2fccf99a.jpeg)

- Ethereum allots 32-byte sized storage slots to store state. Slots start at index `0` and sequentially go up to `2²⁵⁶` slots.
- Basic datatypes are laid out contiguously in storage starting from position `0`, then `1`, until `2²⁵⁶-1`.
- If the _**combined size**_ of sequentially declared data is _**less than 32 bytes**_, then the sequential data points are packed into a single storage slot to optimize space and gas.

> _**Hint:** If you can match up storage data locations between Contract A and Contract B, you can precisely manipulate the desired variables in Contract A._

## Security Considerations

- Ideally, libraries should not store state.
- When creating libraries, use `library`, not `contract`, to ensure libraries will not modify caller storage data when caller uses `delegatecall`.
  Use higher level function calls to inherit from libraries, especially when you i) don’t need to change contract storage and ii) do not care about gas control.

## Source Code

⚠️This contract contains a bug or risk. Do not use on mainnet!

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Preservation {
  // public library contracts
  address public timeZone1Library;
  address public timeZone2Library;
  address public owner;
  uint256 storedTime;
  // Sets the function signature for delegatecall
  bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

  constructor(address _timeZone1LibraryAddress, address _timeZone2LibraryAddress) public {
    timeZone1Library = _timeZone1LibraryAddress;
    timeZone2Library = _timeZone2LibraryAddress;
    owner = msg.sender;
  }

  // set the time for timezone 1
  function setFirstTime(uint256 _timeStamp) public {
    timeZone1Library.delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
  }

  // set the time for timezone 2
  function setSecondTime(uint256 _timeStamp) public {
    timeZone2Library.delegatecall(abi.encodePacked(setTimeSignature, _timeStamp));
  }
}

// Simple library contract to set the time
contract LibraryContract {
  // stores a timestamp
  uint256 storedTime;

  function setTime(uint256 _time) public {
    storedTime = _time;
  }
}

```

## Configuration

### Install Truffle cli

_Skip if you have already installed._

```
npm install -g truffle
```

### Install Dependencies

```
yarn install
```

## Test and Attack!💥

### Run Tests

```
truffle develop
test
```

You should take ownership of the target contract successfully.

```
truffle(develop)> test
Using network 'develop'.


Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



  Contract: Hacker
    √ should claim ownership (393ms)


  1 passing (457ms)

```
