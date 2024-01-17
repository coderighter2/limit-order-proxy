// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IGelatoPineCore {
    function keyOf(
        address _module,
        address _inputToken,
        address payable _owner,
        address _witness,
        bytes calldata _data
    ) external pure returns (bytes32);

    function depositEth(bytes calldata _data) external payable;
}