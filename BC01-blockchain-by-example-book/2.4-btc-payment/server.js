// V1 START
'use strict';

// Some Imports
var bitcore_lib = require('bitcore-lib');
var PaymentProtocol = require('bitcore-payment-protocol');
var express = require('express');
var bodyParser = require('body-parser');
var URI = require('bitcore-lib/lib/uri');
var request = require("request");
const https = require('https');
var fs = require("fs");

// Cert imports
var dcert = fs.readFileSync('./keys/cert.der');
var mcert = fs.readFileSync('./keys/cert.pem'); // For HTTPS server
var mkey = fs.readFileSync('./keys/key.pem');

var credentials = {key: mkey, cert: mcert};
var app = express();

// Get Network Interface in this OS
var os = require('os');
var interfaces = os.networkInterfaces();

var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

// Normal port in 3000, HTTPS in 8883
var IP = addresses[0];
var port = 8883;
var http_port = 3000;


app.get("/", function(req, res) {
    res.send('Bitcoin Payment protocol');
});

app.listen(http_port, function() {
    console.log("-http Server listening on :"+IP+":"+ http_port);
});

https.createServer(credentials, app).listen(port, function() {
    console.log("-https Server listening on :"+IP+":"+ port);
});
// V1 END