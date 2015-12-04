/**
 * KH/A
 * @author Paul Rad <paul@paulrad.com>
 * @homepage https://github.com/paulrad/kick-happy-api
 * @copyright 2015 Paul Rad
 * MIT Licence (MIT)
 */
var Q = require('bluebird');
var Config = require('config');
var _ = require('lodash');

var KH = global['KH'] = {};

// the locals variables
var $$ = {
  'controllers': [],
  'helpers': {}
};

KH.utils = require('./utils.js');
KH.version = require('../package.json')['version'];

/**
 * KH.$store(key, value)
 * @visibility privacy
 *
 * @usages
 * KH.$store('key', 'value');
 * KH.$store('key', 'subkey', 'subsubkey', 'value')
 *
 * @returns KH
 * @todo description
 */
KH.$store = function $store(key, value /* infinite args where value is the last arg */) {
  if (arguments.length === 2) {
    if (KH.utils.isDefined($$[key]) && $$[key]._KH_Magical_Promise === true) {
      // its a KH magic promise
      $$[key].resolve(value);
      $$[key] = _.merge($$[key], value);
    } else {
      // normal setter
      $$[key] = value;
    }
  } else {
    var args = Array.prototype.slice.call(arguments);
    value = args[args.length - 1];
    arguments = args.splice(args.length - 1, 1);
    var nestedKey = args.join('.');
    return KH.$store(nestedKey, value);
  }
  return KH;
};

/**
 * KH.$get(key)
 *
 * @usages
 * KH.$get('key')
 * KH.$get('key', 'subkey');
 * KH.$get('key', 'subkey', 'subsubkey');
 *
 * @visibility privacy
 * @returns KH
 * @todo {mixed} required object key
 */
KH.$get = function $get(key) {
  var args = Array.prototype.slice.call(arguments);
  if (args.length > 1) {
    var nestedKey = args.join('.');
    return KH.$get(nestedKey);
  };
  return $$[key];
};

// @alias without the throwed exception in case of undefined value
// @todo: undo the duplication... move the nestedKey generation away !
KH.$getStrict = function $getStrict(key) {
  var args = Array.prototype.slice.call(arguments);
  if (args.length > 1) {
    var nestedKey = args.join('.');
    return KH.$getStrict(nestedKey);
  };
  if (typeof $$[key] === 'undefined') {
    throw new Error("The required object is not available");
    return undefined;
  }
  return $$[key];
};

// @alias if the value is not ready yet, we return a `magic` promise fulfilled
// by the value when ready
// @todo: undo the duplication... move the nestedKey generation away !
KH.$getPromise = function $getPromise(key) {
  var args = Array.prototype.slice.call(arguments);
  if (args.length > 1) {
    var nestedKey = args.join('.');
    return KH.$getPromise(nestedKey);
  };

  if (typeof $$[key] === 'undefined') {
    var deferred = Q.defer();
    deferred._KH_Magical_Promise = true;
    KH.$store(key, deferred);
  }
  return $$[key];
};

/**
 * KH.config(property)
 * @params {String} property
 * @alias of require('config').get(property)
 * @override
 * Disable the default exception if the property can be found (returns NULL instead)
 */
KH.config = function(property) {
  try {
    var v = Config.get(property);
  } catch (e) {
    return null;
  }
  return v;
};

/**
 * KH.controller(path | route)
 * @params {String} route
 * @params {Object} route Hapi route object
 *
 * @description
 * Getter / Setter of hapi controller
 *
 * @usage (getter)
 * KH.controller('get.index');
 * KH.controller('get.users/{id?}');
 * KH.controller('delete.users/{id}');
 *
 * If the specified controller doesn't exists, KH.controller throw an exception
 *
 * @usage (setter) - used by the internal KH builtins
 * KH.controller({
 *   method: 'GET',
 *    path: '/index',
 *    handler: function(req, reply) {
 *      reply('hello world');
 *    }
 * });
 *
 * @returns {Function} if KH.controller is used as getter
 * @returns {Object} KH if KH.controller is used as setter
 */
KH.controller = function controller(route) {

  // KH.controller({String})
  var getController = function getController() {

    var indexRoute = $$.controllers.find(function(controller) {
      return controller.$$routepath === route;
    });

    if (! indexRoute) {
      throw new Error("Undefined route reference");
    } else {
      return indexRoute;
    }
  };

  // KH.controller({Object})
  var setController = function setController() {

    var routeObjectToString = function routeObjectToString() {
      var routepath = route.path.toLowerCase();

      if (routepath[0] === '/') {
        routepath = routepath.substr(1);
        if (routepath.length === 0) {
          routepath = 'index';
        }
      };

      if (routepath[routepath.length-1] === '/') {
        routepath = routepath.substr(0, routepath.length - 1);
      };

      return route.method.toLowerCase() + '.' + routepath;
    };

    route['$$routepath'] = routeObjectToString(route);

    // setter
    // merge options to route options
    route['$$merge'] = function(options) {
      $$.controllers.forEach(function(controller, idx) {
        if (controller.$$routepath === route.$$routepath) {
          $$.controllers[idx] = _.merge(controller, options);
        }
      });
    };

    $$.controllers.push(route);

    return KH;
  };

  if (KH.utils.isObject(route)) {
    if (! route.method || ! route.path || ! route.handler) {
      throw new Error("The route object should contains method, path and handler properties");
      return KH;
    }
    return setController();
  } else {
    return getController();
  }
};

/**
 * KH.controllers(sanitize)
 * @params {Boolean} sanitize (default = true)
 * @description
 * Return entire controllers list
 */
KH.controllers = function controllers(sanitize) {
  
  // exclude private variables
  // from controllers routes
  var sanitizeObject = function(controllers) {
    return controllers.map(function(controller) {
      for (var k in controller) {
        if (k.substr(0, 2) === '$$') {
          delete controller[k];
        }
      }
      return controller;
    });
  };

  if (KH.utils.isUndefined(sanitize) || sanitize === true) {
    return sanitizeObject($$.controllers);
  } else {
    return $$.controllers;
  }
};

/**
 * KH.extend(methodName, objectProperties)
 * @params {String} methodName
 * @params {Object} objectProperties
 *
 * @description
 * @todo
 * @usage
 * KH.extend('hello', function() { return 'hello'; })
 * > KH.hello(); // returns hello
 *
 * KH.extend('hello.world', function() {
 *   return 'hello world';
 * });
 * > KH.hello.world(); // returns hello world
 * /!\ If you extend a function, the main function will be
 * converted as a singleton instance
 *
 * KH.extend('CONSTANTS', {
 *  lang: 'fr-fr',
 *  minAge: 18
 * });
 *
 * // @todo
 * // detects models extensions
 * KH.extend('models.database.collection.statics', {
 *   doSomething: function() {
 *     return this.model('collection').find({ sent: false }).exec()
 *   }
 * });
 *
 * > KH.model('database.collection').doSomething().then(function() { }); ...
 *
 */
KH.extend = function extend(methodName, objectProperties) {

  function mixin(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
  }

  for (var parts = methodName.split('.'), i=0, l=parts.length, cache = KH; i<l; i++) {
    if (!cache[parts[i]]) { 
      if (i + 1 === l) {
        cache[parts[i]] = objectProperties;
      } else {
        cache[parts[i]] = {};
      }
    } else if (i + 1 === l) {
      var oldProperties = cache[parts[i]];
      if (KH.utils.isFunction(oldProperties)) {
        KH.log('warn', "Previous index was a function and will be converted has class instance");
        oldProperties = new oldProperties();
      }
      cache[parts[i]] = mixin({}, oldProperties, objectProperties);
    }
    cache = cache[parts[i]];
  }

  return KH;
};

/**
 * KH.server()
 * @description
 * Get the current Hapi Server object
 * Defined in sys/server.js
 * @returns {Object} Hapi.Server instance
 */
KH.server = function server() {
  return KH.$get('server');
};
