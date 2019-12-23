pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

contract Cplayer {
  address public admin;

  constructor() public {
    admin = msg.sender;
  }

  modifier onlyadmin(){
    require(msg.sender == admin);
     _;
  }

  // We declare a new type called player, which is a structure (struct) that represents a user’s details.
  struct player {
    string name;
    uint phoneNumber;
    address payable Paddress;
    uint id;
  }

  // This is similar to CREATE TABLE players (`address` varchar(32) NOT NULL,  PRIMARY KEY  (`address`) …);
  mapping(address => player) players;

  // CREATE
  function addPlayer(string memory _name, uint256 _phonenumber) public returns (bool) {
    players[msg.sender].name = _name;
    players[msg.sender].Paddress = msg.sender;
    players[msg.sender].phoneNumber = _phonenumber;
    return true;
  }

  // READ
  function findPlayer(address _address) public view returns (string memory, uint, address) {
    return (players[_address].name, players[_address].phoneNumber, players[_address].Paddress);
  }

  function exist(address _address) public view returns (bool) {
    return (players[_address].Paddress != 0x0000000000000000000000000000000000000000);
  }

  function getplayer(address _address) public view returns (player memory) {
    return players[_address];
  }

  // UPDATE
  function editPlayer(string memory _name, uint256 _phonenumber, address payable _address, uint256 _id) public returns (bool) {
    players[msg.sender].name = _name;
    players[msg.sender].phoneNumber = _phonenumber;
    players[msg.sender].Paddress = _address;
    players[msg.sender].id = _id;
    return true;
  }

  // Function overloading
  function editPlayer(address _address, uint256 _id) public returns (bool) {
    players[_address].id = _id;
    return true;
  }

  // DELETE
  function removePlayer(address _address) public onlyadmin returns (bool) {
    delete players[_address];
    return true;
  }
}

interface Itontine {
  function join() external payable returns (bool);
  function ping() external returns (bool);
  function eliminate(address a) external returns (bool);
  function claimReward() external returns (bool);
  event NewActivePlayerEv(address _address, uint time);
  event EliminatedPlayerEv(address _address);
}

contract Ctontine is Itontine {
  mapping (address => uint256 ) public Tpension;
  Cplayer.player[] public active_players;
  Cplayer.player[] public eliminated_players;
  mapping (address => uint) public ping_time;
  uint256 public Lindex;
  Cplayer Tplayer;

  constructor(address _CplayerAddress) public {
    Tplayer = Cplayer(_CplayerAddress);
  }

  function join() public payable returns(bool) {
    require(Tplayer.exist(msg.sender), "player doesn't exist");
    require(msg.value >= 1 ether && Tpension[msg.sender] == 0, "send higher pension");
    Tpension[msg.sender] = msg.value;
    Tplayer.editPlayer(msg.sender, active_players.length); // Make this ID
    active_players.push(Tplayer.getplayer(msg.sender));
    Lindex += (active_players.length - 1);
    ping_time[msg.sender] = now;
    emit NewActivePlayerEv(msg.sender, now);
    return true;
  }

  function ping() external returns(bool) {
    ping_time[msg.sender] = now;
    return true;
  }

  function eliminate(address PlayerAddress) external  returns(bool) {
    // Ensure that we can eliminate only players who didn’t ping the contract within the last 24 hours.
    require(now > ping_time[PlayerAddress] + 1 days);
    delete Tpension[PlayerAddress]; 
    delete active_players[Tplayer.getplayer(PlayerAddress).id];
    Lindex -= Tplayer.getplayer(PlayerAddress).id;
    eliminated_players.push(Tplayer.getplayer(PlayerAddress));
    Tplayer.editPlayer(msg.sender, 0);
    // This will share the balance of the eliminated player between the remaining active players.
    share_pension(PlayerAddress);
    emit EliminatedPlayerEv(PlayerAddress);
    return true;
  }

  function share_pension(address user) internal returns (bool) {
    uint256 remainingPlayers = remaining_players();
    for(uint256 i = 0; i < active_players.length; i++){
      if (active_players[i].Paddress != 0x0000000000000000000000000000000000000000) {
        Tpension[active_players[i].Paddress] = calcul(Tpension[user], remainingPlayers, 18);
      }
    }
    return true;
  }

  function remaining_players() public view returns (uint256) {
    return (active_players.length - eliminated_players.length);
  }

  function calcul(uint a, uint b, uint precision) public pure returns (uint) {
    require(b != 0);
    return a * (10 ** (precision)) / b;
  }

  function claimReward() external returns (bool) {
    require(remaining_players() == 1);
    active_players[Lindex].Paddress.transfer(address(this).balance);
    return true;
  }
}