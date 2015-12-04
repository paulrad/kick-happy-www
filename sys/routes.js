var routes = KH.utils.getFiles('routes/**/*.js', true);

if (routes) {
  routes.forEach(function(route) {
    var routeArray = require(route);

    if (KH.utils.isArray(routeArray)) {

      routeArray.forEach(function(route) {
        // @todo
        // add verbosity on trace mode
        KH.controller(route);
      });
    } else {
      // @todo
      // debug or trace - route is not an array
    }

  });
}