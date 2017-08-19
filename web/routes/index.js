var express = require('express');
var router = express.Router();
var Web3 = require('web3');

var fromBlock = 0;

router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {
  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  var body = JSON.stringify(req.body);
  var abi = JSON.parse(body).abi;
  var contractAddress = JSON.parse(body).contractAddress;
  console.log('abi', JSON.stringify(abi));
  console.log('contractAddress', contractAddress);

  var Contract = web3.eth.contract(abi);
  var contractInstance = Contract.at(contractAddress);

  var evt = contractInstance.Transfer({},{fromBlock: fromBlock, toBlock: 'latest'});

  evt.watch(function(error, result){
      // console.log("error", error); 
      // console.log("result", result);
      // console.log('result.args._value', result.args._value);
      //console.log(Date().now, result.args._value);
      var now = Math.floor(new Date().getTime() / 1000);
      console.log(now, result.args._value);
      evt.stopWatching();
      fromBlock = evt.blockNumber;
      res.io.emit("msg", {timestamp:now, value:result.args._value});
  });
  
  console.log('about to end')
  res.end('');
});
module.exports = router;
