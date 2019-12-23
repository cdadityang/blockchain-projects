// import Web3 from "web3";
// import SimpleStorage from "./contracts/SimpleStorage.json";
// import ComplexStorage from "./contracts/ComplexStorage.json";
// import TutorialToken from "./contracts/TutorialToken.json";

// const options = {
//   web3: {
//     block: false,
//     customProvider: new Web3("ws://localhost:7545"),
//   },
//   contracts: [SimpleStorage, ComplexStorage, TutorialToken],
//   events: {
//     SimpleStorage: ["StorageSet"],
//   },
//   polls: {
//     accounts: 1500,
//   },
// };

// export default options;


import Web3 from "web3";
import Cplayer from './contracts/Cplayer.json'
import Ctontine from './contracts/Ctontine.json'

const drizzleOptions = {
    web3: { 
        block: false,
        fallback: { 
            type: 'ws', 
            url: 'ws://127.0.0.1:7545'
        }
    },
    contracts: [ Cplayer, Ctontine ],
    events: { 
        Ctontine: [
           'NewActivePlayerEv', 
           'EliminatedPlayerEv'
        ],
    },
    polls: { accounts: 1500 }
}

export default drizzleOptions;