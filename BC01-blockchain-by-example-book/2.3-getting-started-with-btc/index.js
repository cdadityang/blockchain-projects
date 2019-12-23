var bitcore = require('bitcore-lib');
var Address = bitcore.Address;
var address = Address.fromString('tb1qvn3m84dl5dpgujxxu7dhmguv8j092avx05sd5g');

// The bitcore.Script object provides an interface to construct bitcoin scripts.
// It also gives simple interfaces to create the most common script types, such as buildPublicKeyHashOut(address), which creates a Pay-to-Public-Key-Hash (PPKH) output for the given address.
var script = bitcore.Script.buildPublicKeyHashOut(address);
console.log(script);