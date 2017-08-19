pragma solidity ^0.4.11;

import {SafeMath} from './SafeMath.sol';

contract Redlighting {
    using SafeMath for uint256;

    uint ethPerNrg = 1;
    address public owner;
    event payEvent(address indexed buyerAddress, uint amount, uint expireTime);
    
    struct User {
        uint deposit;
        uint depositTime;
        uint expireTime;
    }  

    mapping(address => User) public allUsers;

    modifier owner_only {
        assert(msg.sender == owner);
        _;
    }

    function RedLightning() {
        owner = msg.sender;
    }

    function() payable {
        User storage user = allUsers[msg.sender];
		user.deposit = msg.value;
        user.expireTime = block.timestamp + (msg.value / ethPerNrg);
        payEvent(msg.sender, msg.value, user.expireTime);
    }

    function updateNrgRate(uint8 _ethPerNrg) owner_only {
        ethPerNrg = _ethPerNrg;
    }
}