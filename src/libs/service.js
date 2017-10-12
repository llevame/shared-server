var jwt = require('jwt-simple');  
var moment = require('moment');  
var env = require('node-env-file');
var process = env(__dirname + '/../../process.env');
exports.createToken = function(id) {  
  var payload = {
    sub: id,
    iat: moment().unix(),
    exp: moment().add(2, "days").unix(),
  };
  return jwt.encode(payload, process.TOKEN_SECRET);
};
