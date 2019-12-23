var bitcoin = require('bitcoinjs-lib');
var rp = require('request-promise');

// The message to be embedded in the transaction
var data = Buffer.from('Hello World', 'utf8');
// The network—testnet
var testnet = bitcoin.networks.testnet;
// The private key in WIF (short for Wallet Import Format)
var privateKey = 'cVZtakZf9qZZ5S5DmvyBPAUWfar3Nb99gkkV1qoPZhJEUzYXQihi';
// The source address from which we spend the UTXO
var SourceAddress = "tb1qqqtc3x3sh9ndpt4xhwjxsl755nuysrvenzs3pq";

// Then we ask the API to provide us with the available unspent output belonging to a specific address. We read the response from the API to define the available amount and the output `txid`

// We also define the fee (5,000 satoshis) to pay the network (miners) for processing the transaction, as follows: 
var url = "https://sochain.com/api/v2/get_tx_unspent/BTCTEST/" + SourceAddress;
var DestionationAddress = 'tb1qqqtc3x3sh9ndpt4xhwjxsl755nuysrvenzs3pq';
var options = {
    uri: url,
    json: true
};

rp(options).then(function (response) {
    var index = response.data.txs.length - 1;
    console.log(response.data.txs[index]);
    var UtxoId = response.data.txs[index].txid;
    var vout = response.data.txs[index].output_no;
    var amount = Number(response.data.txs[index].value*100000000);
    var fee = 0.0005*100000000; 

    // Now it's time to create our transaction. Inside the previous GET request, add the following lines: 

    // Here we are using TransactionBuilder from bitcoinjs-lib to create our new raw transaction. Then we add the output we requested earlier from the API as input to our transaction.
    // We add two outputs: the first is an OP_RETURN output with 0 bitcoins, and the second is the output with 100,000,000 satoshis (one bitcoin), minus the fees.
    const RawTransaction = new bitcoin.TransactionBuilder(testnet);
    RawTransaction.addInput(UtxoId, vout);
    RawTransaction.addOutput(DestionationAddress, parseInt(amount-fee));
    scrypt = bitcoin.script.compile([bitcoin.opcodes.OP_RETURN,data]);
    RawTransaction.addOutput(scrypt, 0);

    // Sign the key
    var keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, testnet);
    // This line is because we are consuming a Pay-to-Public-Key-Hash (P2PKH) output.
    tx.sign(0, keyPair);

    // For P2SH transactions, we need to use the following code instead:
    // const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet });
    // const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: bitcoin.networks.testnet});
    // RawTransaction.sign(0, keyPair, p2sh.redeem.output, null, parseInt(amount));

    // Lastly, we take the signed transaction in and send it to the specified network using a POST request with the API. We provide in our request a JSON object, which contains a hex representation of the signed transaction, as follows:
    var Transaction=RawTransaction.build().toHex();
    var Sendingoptions = { method: 'POST', url: 'https://sochain.com/api/v2/send_tx/BTCTEST',
    body: {tx_hex: Transaction},  json: true};

    rp(Sendingoptions).then(function (response) {
        var Jresponse = JSON.stringify(response);
        console.log("Transaction ID:\n"+Jresponse);
    }).catch(function (err) { console.error(err); }); 
}).catch(function (err) { console.error(err);}); 