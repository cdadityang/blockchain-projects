pragma solidity ^0.5.11;

// Contract with name Auction
contract Auction {
    address payable internal auction_owner;
    uint256 public auction_start;
    uint256 public auction_end;
    uint256 public highestBid;
    address public highestBidder;

    enum auction_state {
        CANCELLED, STARTED
    }

    struct car {
        string Brand;
        string Rnumber;
    }

    car public Mycar;

    address payable[] bidders;

    mapping(address => uint) public bids;
    
    auction_state public STATE;

    modifier an_ongoing_auction() {
        require(now <= auction_end);
        _;
    }

    modifier only_owner() {
        require(msg.sender == auction_owner);  
        _;
    }

    function bid() public payable returns (bool) {}
    function withdraw() public returns (bool) {}
    function cancel_auction() external returns (bool) {}

    event BidEvent(address indexed highestBidder, uint256 highestBid);
    event WithdrawalEvent(address withdrawer, uint256 amount);
    event CanceledEvent(string message, uint256 time);  
}

contract MyAuction is Auction {
    constructor (uint _biddingTime, address payable _owner,string memory _brand,string memory _Rnumber) public { 
        auction_owner = _owner;
        auction_start = now;
        auction_end = auction_start + _biddingTime* 1 hours;
        STATE = auction_state.STARTED;
        Mycar.Brand = _brand;
        Mycar.Rnumber = _Rnumber;
    }
    
    function bid() public payable an_ongoing_auction returns (bool){
        require(bids[msg.sender] + msg.value > highestBid, "can't bid, Make a higher Bid");
        highestBidder = msg.sender;
        highestBid = msg.value;
        bidders.push(msg.sender);
        bids[msg.sender] = bids[msg.sender] + msg.value;
        emit BidEvent(highestBidder, highestBid); 
        return true;
    }
    
    function cancel_auction() only_owner an_ongoing_auction external returns (bool) {
        STATE = auction_state.CANCELLED;
        emit CanceledEvent("Auction Cancelled", now);
        return true;
    }
    
    function withdraw() public returns (bool){
        require(now > auction_end , "can't withdraw, Auction is still open");
        uint amount = bids[msg.sender];
        bids[msg.sender] = 0;
        msg.sender.transfer(amount);
        emit WithdrawalEvent(msg.sender, amount);
        return true;
    }
    
    function payback_participants() internal returns (bool){
        uint256 payback = 0;
        for (uint256 i = 0; i < bidders.length; i++)
        {        
            if (bids[bidders[i]] > 0) {
                payback = bids[bidders[i]];
                bids[bidders[i]] = 0;
                bidders[i].transfer(payback);
            }   
        }           
        return true;
    }
    
    function destruct_auction() external only_owner returns (bool) {
        require(now > auction_end, "You can't destruct the contract,The auction is still open");
        for (uint i = 0; i < bidders.length; i++)
        {
            assert(bids[bidders[i]] == 0);
        }
        selfdestruct(auction_owner);
        return true;
    }
}