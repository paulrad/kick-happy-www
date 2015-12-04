/**
 * Defaults usefull helpers for HapiJS
 */

/**
 * @usage
 * KH.helpers.hapi.controllers(expr, options)
 * @description
 * todo
 * @exemples
 * todo
 */
var Controllers = function(expr, options) {

  if (expr === '*') {
    expr = '.*';
  }

  var r = new RegExp(expr);

  KH.controllers(false).filter(function(route) {
    if (route.$$routepath.match(r)) {
      route.$$merge(options);
    }
  });
};

// Registering
KH.extend('helpers.hapi', {
  controllers: Controllers
});