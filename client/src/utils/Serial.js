var serialize = require('serialize-javascript'); // eslint-disable-next-line
var deserialize = str => eval(`(${str})`);

module.exports = {serialize, deserialize};