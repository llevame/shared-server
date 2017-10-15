var moment = require('moment'); 

exports.authorizeUser = function(req) {  
  var env = require('node-env-file');
  var process = env('./process.env');
  var log = require('log4js').getLogger("consola");
/*
  if(!req.headers) {
    message = "Header section does not exists."
    return message;
  }
  if(!req.headers.authorization) {
    message = "Header section in request does not exists."
    return message;
  }
  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, process.TOKEN_SECRET, function() {});

  if(payload.exp <= moment().unix()) {
	message = "Token expired.";
	return message;
  }
*/
  return true;
}
