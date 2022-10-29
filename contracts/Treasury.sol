// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./abstract/Ownable.sol";
import "./abstract/Pausable.sol";
import "./abstract/ReentrancyGuard.sol";
import "../node_modules/openzeppelin-solidity/contracts/interfaces/IERC20.sol";

error Treasury__NotAdmin();
error Treasury__NotOperator();
error Treasury__NotAdminOrOperator();
error Treasury__AddressCantBeZero();
error Treasury__PercentageCantBeMoreThanZero();

contract Treasury is Ownable, Pausable, ReentrancyGuard {
    ///@notice immutable because we want to set it just once
    address private immutable i_admin;
    address private s_operator;

    ///@notice token in which we store our balance,TUSD for example
    IERC20 private s_token;

    ///@notice percentage of tokens we want to burn with burn() function
    uint8 private s_percentageOfBurn;

    ///@notice percantage of tokens that owner of golden ticket will have
    uint8 private s_percentageOfGoldenTicket;

    ///@notice Balances<walletAddress, <periodId, balance>
    mapping(address => mapping(uint8 => uint256)) private balances;

    ///@notice PeriodsBalance<periodId, balance>
    mapping(uint8 => uint256) private periodsBalances;

    ///@notice Periods<periodId, <walletAddress, balance>>
    mapping(uint8 => mapping(address => uint256)) private periods;

    ///@dev using revert,because it's more gas efficient
    modifier onlyAdmin() {
        if (msg.sender != i_admin) {
            revert Treasury__NotAdmin();
        }
        _;
    }

    modifier onlyOperator() {
        if (msg.sender != s_operator) {
            revert Treasury__NotOperator();
        }
        _;
    }

    modifier onlyAdminOrOperator() {
        if (msg.sender != i_admin && msg.sender != s_operator) {
            revert Treasury__NotAdminOrOperator();
        }
        _;
    }

    ///@notice modifier for checking if address is not zero
    modifier notZeroAddress(address _address) {
        if (_address == address(0)) {
            revert Treasury__AddressCantBeZero();
        }
        _;
    }

    ///@notice modifier for checking if percentage is okay
    modifier properPercentage(uint8 percentage) {
        if (percentage > 100) {
            revert Treasury__PercentageCantBeMoreThanZero();
        }
        _;
    }

    constructor(
        address _adminAddress,
        address _operator,
        address _tokenAddress,
        uint8 _percentageOfBurn,
        uint8 _percentageOfGoldenTicket
    ) {
        i_admin = _adminAddress;
        s_operator = _operator;
        s_token = IERC20(_tokenAddress);
        s_percentageOfBurn = _percentageOfBurn;
        s_percentageOfGoldenTicket = _percentageOfGoldenTicket;
    }

    function weeklyCalculation() external returns (uint256) {}

    function burn() private {}

    function goldenTicket() private {}

    function withdraw(address _userWallet, uint256 _amount) public {}

    ///@notice setting new operator,this could do only admin
    function setOperator(address _operator)
        external
        onlyAdmin
        notZeroAddress(_operator)
    {
        s_operator = _operator;
    }

    ///@notice setting new token,like BUSD
    function setToken(address _token)
        external
        onlyAdminOrOperator
        notZeroAddress(_token)
    {
        s_token = IERC20(_token);
    }

    ///@notice setting new percentage for burn
    function setPercentageOfBurn(uint8 _percentage)
        external
        onlyAdmin
        properPercentage(_percentage)
    {
        s_percentageOfBurn = _percentage;
    }

    ///@notice setting new percentage for golden ticket
    function setPercentageOfGoldenTicket(uint8 _percentage)
        external
        onlyAdmin
        properPercentage(_percentage)
    {
        s_percentageOfGoldenTicket = _percentage;
    }

    function getAdmin() public view returns (address) {
        return i_admin;
    }

    function getOperator() public view returns (address) {
        return s_operator;
    }

    function getTokenAddress() public view returns (address) {
        return address(s_token);
    }

    function getPercentageOfBurn() public view returns (uint8) {
        return s_percentageOfBurn;
    }

    function getPercentageOfGoldenTicket() public view returns (uint8) {
        return s_percentageOfGoldenTicket;
    }
}
