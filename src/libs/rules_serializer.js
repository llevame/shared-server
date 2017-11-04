// wrapper for serializer functions provided 
// by the 'serialize-javascript' module

var serialize = require('serialize-javascript');
var deserialize = str => eval(`(${str})`);

module.exports = {serialize, deserialize};
