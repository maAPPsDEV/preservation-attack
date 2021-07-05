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
pragma solidity ^0.6.0;

contract Token {
  mapping(address => uint256) balances;
  uint256 public totalSupply;

  constructor(uint256 _initialSupply) public {
    balances[msg.sender] = totalSupply = _initialSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool) {
    require(balances[msg.sender] - _value >= 0);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    return true;
  }

  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner];
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
    √ should steal countless of tokens (377ms)


  1 passing (440ms)

```
