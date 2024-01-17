// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/IGelatoPineCore.sol";
import "./interface/IERC20OrderRouter.sol";

contract LimitOrderProxy is Ownable {

    using SafeMath for uint256;

    IGelatoPineCore public immutable gelatoPineCore;
    IERC20OrderRouter public immutable erc20Router;
    address public treasury;
    uint256 public feeRate;

    constructor(IGelatoPineCore _gelatoPineCore, IERC20OrderRouter _erc20Router, address _treasury) {
       gelatoPineCore = _gelatoPineCore;
       erc20Router = _erc20Router;
       treasury = _treasury;
       feeRate = 20;
    }

    receive() external payable {
        require(
            msg.sender != tx.origin,
            "PineCore#receive: NO_SEND_ETH_PLEASE"
        );
    }

    function setFeeRate(uint256 _feeRate) external onlyOwner {
        require(feeRate <= 100, "Fee must be less than 10%");
        feeRate = _feeRate;
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function withdrawETH(address _wallet) external onlyOwner {
        require(_wallet != address(0), "Zero address transfer");
        uint256 balance = address(this).balance;
        require(balance > 0, "no balance");
        (bool success,) = _wallet.call{value: balance}(new bytes(0));
        require(success, 'ETH_TRANSFER_FAILED');
    }

    function withdrawERC20(address _wallet, IERC20 token) external onlyOwner {
        require(_wallet != address(0), "Zero address transfer");
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "no balance");
        token.transfer(_wallet, balance);
    }

    function depositEth(bytes calldata _data) external payable {
        require(msg.value > 0, "PineCore#depositEth: VALUE_IS_0");
        uint256 feeAmount = msg.value.mul(feeRate).div(1000);
        uint256 amount = msg.value.sub(feeAmount);
        if (treasury != address(0) && feeAmount > 0) {
            (bool success,) = treasury.call{value:feeAmount}(new bytes(0));
            require(success, 'ETH_TRANSFER_FAILED');
        }
        gelatoPineCore.depositEth{value: amount}(_data);
    }

    function depositToken(
        uint256 _amount,
        address _module,
        address _inputToken,
        address payable _owner,
        address _witness,
        bytes calldata _data,
        bytes32 _secret
    ) external {

        uint256 balanceBefore = IERC20(_inputToken).balanceOf(address(this));
        IERC20(_inputToken).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        uint256 balanceAfter = IERC20(_inputToken).balanceOf(address(this));
        uint256 amount = balanceAfter.sub(balanceBefore);
        uint256 feeAmount = amount.mul(feeRate).div(1000);
        uint256 actualAmount = amount.sub(feeAmount);

        if (treasury != address(0) && feeAmount > 0) {
            IERC20(_inputToken).transfer(treasury, feeAmount);
        }

        IERC20(_inputToken).approve(address(erc20Router), actualAmount);
        erc20Router.depositToken(
            actualAmount,
            _module,
            _inputToken,
            _owner,
            _witness,
            _data,
            _secret
        );
    }
}
