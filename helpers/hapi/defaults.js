// setDefaults
// Set defaults configurations options for routes matching with the expression
var setDefaults = function() {

  // For each controllers (*)
  KH.helpers.hapi.controllers('*', {
    config: {
      validate: {
        failAction: function(req, reply, source, error) {
          error.output.payload.error = "Very bad request";
          delete error.output.payload.validation;
          reply(error);
        }
      }
    }
  });

  // For each GET
  KH.helpers.hapi.controllers('get.', {
    config: {
      timeout: {
        server: 10000
      }
    }
  });
};

// installRoutes
// loop over controllers and set route in hapi.server instance
var installRoutes = function() {
  KH.log('info', "Installing routes");
  KH.controllers().forEach(function(route) {
    KH.log('debug', "Installing new route %s:%s", route.method, route.path);
    KH.server().route(route);
  });
  KH.log('debug', "Routes successfully installed");
};

// assets
KH.server().register(require('inert'), function (err) {

  if (err) {
    throw err;
  }

  KH.server().route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: 'public/assets/builds',
        listing: false
      }
    }
  });

});


// When server start ;)
KH.server().on('start', setDefaults);
KH.server().on('start', installRoutes);
KH.server().on('start', function(err) {
  KH.log("info", "Server is ready on %s:%s", KH.server().info.host, KH.server().info.port);
});