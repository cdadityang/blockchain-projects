var bitcore = require('bitcore-lib');
bitcore.Transaction = require('bitcore-lib').Transaction;
bitcore.Script = require('bitcore-lib').Script;


var lockingscript = bitcore.Script().add('OP_13')
.add('OP_ADD')
.add('OP_15')
.add('OP_EQUAL')

var utxo='ec3a95cd9beffabcaca5b0bb2ff86d596f9c50c741167613afb9b89b0d04f05e'
var Saddress='n4kUjtjUpkE2P9Dkg4b6QPf4KsQRneTqNy'
var pkey='cSFmdX2KhaZf3DTLTgY3Z9EEnZCVWsKHUD1qTXDRFJ3qRvQDtLvD'
var Taddress='2N7rVMcUgHwuZD3HYDrDncrHz2agcH1xbQi'

var g_utxos = [{"address":Saddress,"txid":utxo,
"vout":0,"scriptPubKey":"210323f1fcd993c66283cc83432ae5fd94f0457cd00b4fe91c0b85639d44beb4e3a1ac","amount":50.0}];

var transaction = new bitcore.Transaction();
transaction = transaction.from(g_utxos);
transaction = transaction.to(Taddress, 4000000000);
transaction = transaction.fee(0.0001*100000000);

transaction = transaction.addOutput(new bitcore.Transaction.Output({
    script: lockingscript,
    satoshis: 1000000000,
address:Taddress
  }));
transaction=transaction.sign(pkey);
console.log("Raw Transaction\n"+transaction);

var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(stdout) }
exec("bitcoin-cli decoderawtransaction "+transaction, puts);

// var pkey = 'cSFmdX2KhaZf3DTLTgY3Z9EEnZCVWsKHUD1qTXDRFJ3qRvQDtLvD'; //UTXO's private key
// var Taddress = '2N7rVMcUgHwuZD3HYDrDncrHz2agcH1xbQi'; //Destination address
// var lockingscript = bitcore.Script('OP_13 OP_ADD OP_15 OP_EQUAL'); //PubKeyScript
// var g_utxos=[{"address":"n4kUjtjUpkE2P9Dkg4b6QPf4KsQRneTqNy", "txid":"ec3a95cd9beffabcaca5b0bb2ff86d596f9c50c741167613afb9b89b0d04f05e","vout":0,"scriptPubKey":"210323f1fcd993c66283cc83432ae5fd94f0457cd00b4fe91c0b85639d44beb4e3a1ac","amount":50.0}]; //UTXO details

// var transaction = new bitcore.Transaction();
// transaction = transaction.from(g_utxos);
// transaction = transaction.to(Taddress, 3000000000); //Add a first output with the given amount of satoshis
// transaction = transaction.fee(0.0001*1000);
// transaction = transaction.addOutput(new bitcore.Transaction.Output({script: lockingscript, satoshis: 1000000000,address:Taddress }));
// transaction = transaction.sign(pkey); //Sign all inputs
// console.log("Raw Transaction\n" + transaction);