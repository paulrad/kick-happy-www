var pJson = require('../package.json');
var BASE_PATH = require('path').join(__dirname, '..', 'public', 'views');
var VIEWS_PATH = require('path').join(BASE_PATH, 'routes');
var LAYOUTS_PATH = require('path').join(BASE_PATH, 'layouts');
var swig = require('swig');

var engineOptions = KH.config('engine.swig');
engineOptions['locals'] = KH.config('locals');

// @todo: move away
engineOptions['locals']['media'] = function(path) {
  return engineOptions['locals']['cdn'] + path + '?r' + pJson.version;
};

engineOptions['locals']['printIfElse'] = function(condition, ifValue, elseValue) {
  return condition === true ? ifValue : elseValue;
};

// set up templates with the same view path
swig.setDefaults(engineOptions);

  // Configuration des vues
KH.server().register(require('vision'), function(err) {

  KH.server().views({
    engines: {
      html: swig
    },
    isCached: false,
    compileMode: 'sync',
    path: VIEWS_PATH
  });

});
