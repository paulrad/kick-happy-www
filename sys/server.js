var Config = require('config');
var Hapi = require('hapi');

var server = new Hapi.Server( Config.get('server.options') );

server.connection( Config.get('server.connection') );

server.start(function(err) {
  // @todo
  // present a verbosity... and some useful informations about the connection
  if (err) {
    KH.log("error", "Hum.. Something is wrong");
    throw err;
    return ;
  }
});

KH.$store('server', server);