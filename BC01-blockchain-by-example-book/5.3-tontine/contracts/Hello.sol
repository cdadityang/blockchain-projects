pragma solidity ^0.5.12;

contract Hello {
    string message = "Hello world";

    function setMessage(string memory msgg)  public {
        message = msgg;
    }
    function getMessage() public view returns (string memory){
        return message;
    }
}