// var web3;

if (typeof web3 !== 'undefined') {
  window.web3 = new Web3(web3.currentProvider);
  console.log("Metamask used"); 
} else {
  // change to your RPC provider IP and Port
  // var web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/8165e9acaf3f49e78411a5a137cb29dc');
  // web3 = new Web3(web3Provider);
  console.log('No web3? You should consider trying MetaMask!');
  web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/8165e9acaf3f49e78411a5a137cb29dc'));
}

var bidder = web3.eth.accounts[0];
web3.eth.defaultAccount = bidder;
var auctionContract =  web3.eth.contract([
  {
    "constant": true,
    "inputs": [],
    "name": "Mycar",
    "outputs": [
      {
        "internalType": "string",
        "name": "Brand",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "Rnumber",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "bid",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "cancel_auction",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdraw",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "bids",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "auction_start",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "highestBidder",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "auction_end",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "STATE",
    "outputs": [
      {
        "internalType": "enum Auction.auction_state",
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "highestBid",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "highestBidder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "highestBid",
        "type": "uint256"
      }
    ],
    "name": "BidEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "withdrawer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "WithdrawalEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "time",
        "type": "uint256"
      }
    ],
    "name": "CanceledEvent",
    "type": "event"
  }
]);

var contractAddress = "0x88dedba3860b59363df6db2aaafc6226e7e3db9b";
var auction = auctionContract.at(contractAddress); 

function bid() {
  var mybid = document.getElementById('value').value;
  // Automatically determines the use of call or sendTransaction based on the method type
  auction.bid({from: web3.eth.accounts[0],value: web3.toWei(mybid, "ether"), gas: 200000}, function(error, result){
    if(error) {
      console.log("error is "+ error); 
      document.getElementById("biding_status").innerHTML="Think to bidding higher"; 
    }
    if (!error){
      document.getElementById("biding_status").innerHTML="Successfull bid, transaction ID"+ result; 
    }
  });
} 
  

  
function init(){
 
 auction.auction_end( function(error, result){
document.getElementById("auction_end").innerHTML=result;
});

  auction.highestBidder(function(error, result){
document.getElementById("HighestBidder").innerHTML=result;
}); 
    
auction.highestBid( function(error, result){
var bidEther = web3.fromWei(result, 'ether');
document.getElementById("HighestBid").innerHTML=bidEther;

}); 
  auction.STATE( function(error, result){
document.getElementById("STATE").innerHTML=result;

}); 

  auction.Mycar( function(error, result){
document.getElementById("car_brand").innerHTML=result[0];
document.getElementById("registration_number").innerHTML=result[1];

}); 

auction.bids(bidder, function(error, result){
var bidEther = web3.fromWei(result, 'ether');
document.getElementById("MyBid").innerHTML=bidEther;

console.log(bidder);
}); 
}
   
var auction_owner=null;
//   auction.get_owner(function(error, result){
//     if (!error){
//       auction_owner=result;
//      if(bidder!=auction_owner)
//      $("#auction_owner_operations").hide();
//     }

// }); 
  
  
function cancel_auction(){
auction.cancel_auction( function(error, result){
console.log(result);
}); 
}

function Destruct_auction(){
auction.destruct_auction( function(error, result){
console.log(result);
}); 
}
  
/*filter.get(callback): Returns all of the log entries that fit the filter.
filter.watch(callback): Watches for state changes that fit the filter and calls the callback. See this note for details.*/
var BidEvent = auction.BidEvent(); // var BidEvent = auction.BidEvent(({}, {fromBlock: 0, toBlock: 'latest'});

  
    BidEvent.watch(function(error, result){
            if (!error)
                {
                    $("#eventslog").html(result.args.highestBidder + ' has bidden(' + result.args.highestBid + ' wei)');
                } else {
 
                    console.log(error);
                }
        });
  
 var CanceledEvent = auction.CanceledEvent();
  
    CanceledEvent.watch(function(error, result){
            if (!error)
                {
                              console.log(result);

                    $("#eventslog").html(result.args.message+' at '+result.args.time);
                } else {
 
                    console.log(error);
                }
        });
  
     
const filter = web3.eth.filter({
  fromBlock: 0,
  toBlock: 'latest',
  address: contractAddress,
  topics: [web3.sha3('BidEvent(address,uint256)')]
})
 
filter.get((error, result) => {
     if (!error)
  console.log(result);
  //console.log(result[0].data);
 
})