/**
 * KH/A
 * @author Paul Rad <paul@paulrad.com>
 * @homepage https://github.com/paulrad/kick-happy-api
 * @copyright 2015 Paul Rad
 * MIT Licence (MIT)
 */

var fs = require('fs');
var glob = require('glob');

/**
 * getDependencies(dependencies, setGlobal)
 * @params dependencies {String}
 * @params setGlobal {Boolean} default = false
 * @usage
 * getDependencies('dependencies') 
 * @returnsType {Array}
 * @returns Array of fetched dependencies
 */
var getDependencies = function getDependencies(dependencies, setGlobal /* false */) {

  if (typeof dependencies === 'string') {
    dependencies = require('../package.json')[dependencies];
  }

  var formatName = function formatName(name) {
    var hash = '';
    if (~name.indexOf('-')) {
      var namearr = name.split('-');

      if (name !== 'gulp' && name.substr(0, 4) === 'gulp') {
        hash = 'g' + (namearr.length > 2 ? 
            namearr.splice(0, 1) && namearr.join('') : 
            namearr[namearr.length - 1]
          );
      } else {
        hash = name.replace(/(\-\w)/g, function (m) {
          return m[1].toUpperCase();
        });
      }
    } else {
      hash = name;
    }
    return hash;
  };

  var outDependencies = {};

  for (var dependency in dependencies) {
    outDependencies[formatName(dependency)] = require(dependency);
  }

  if (setGlobal === true) {
    for (var dependency in outDependencies) {
      global[dependency] = outDependencies[dependency];
    }
    delete outDependencies;
    return true;
  }

  return outDependencies;
};

/**
 * getFiles(string: path, string: realpath)
 * @params {String} path
 * @params {String} extensions
 * @return
 * Tableau de fichiers en chemin absolu si realpath est à true
 */
var getFiles = function getFiles(path, realpath) {
  return glob.sync(path, {
    cwd: require('path').join(__dirname, '..'),
    nodir: true,
    realpath: realpath
  });
};

var getDirectories = function getDirectories(path, realpath) {
  if (path[path.length - 1] !== '/') {
    path += '/';
  }
  return glob.sync(path, {
    cwd: require('path').join(__dirname, '..'),
    realpath: realpath
  });
};

/**
 * loadFiles
 * Charge le contenu des fichiers présent dans 'path'
 * @returnsType {Object}
 * @returns A object which contains each files contents
 */
var loadFiles = function loadFiles(path) {
  return getFiles(path, true).map(function(file) {
    return require(file);
  });
};

/**
 * isFile
 * Is `path` is a file ?
 * @returns {boolean} `true` if the given file is a type file
 */
var isFile = function isFile(path) {
  try {
    var check = fs.lstatSync(path).isFile();
  } catch(e) {
    throw e;
    return false;
  }
  return check;
};

/**
 * isDirectory
 * Is `path` is a directory ?
 * @returns {boolean} `true` if the given file is a type directory
 *
 * @todo fix (symlinks..)
 */
var isDirectory = function isDirectory(path) {
  return !isFile(path);
};

/**
 * isArray
 * Is `arg` is an array ?
 *
 * @param {*} reference to check
 * @retruns {boolean} true if argument is an array
 */
var isArray = Array.isArray;

/**
 * isObject
 * Is `argument` is an object ?
 *
 * @param {*} reference to check
 * @returns {boolean} True if `arg` is a valid `object` and different of NULL
 */
var isObject = function isObject(arg) {
  return arg !== null && typeof arg === 'object';
};

/**
 * isString
 * Determines if a value is a string
 *
 * @param {*} reference to check
 * @returns {boolean} True if `arg` is a `String`
 */
var isString = function isString(arg) {
  return typeof arg === 'string';
};

/**
 * isFunction
 * Determines if a value is a function
 *
 * @param {*} reference to check
 * @returns {boolean} True if `arg` is a `Function`
 */
var isFunction = function isFunction(arg) {
  return typeof arg === 'function';
};

/**
 * isPromise
 * Determines if a value is a promise
 *
 * @param {*} reference to check
 * @returns {boolean} True if `arg` is a `Promise`
 */
var isPromise = function isPromise(arg) {
  return isObject(arg) && isFunction(arg.then);
};

/**
 * isDefined
 * Determines if a value is defined
 *
 * @param {*} reference to check
 * @returns {boolean} True if `arg` is defined
 */
var isDefined = function isDefined(arg) {
  return typeof arg !== 'undefined';
};

/**
 * isUndefined
 * Determines if a value is undefined
 *
 * @param {*} reference to check
 * @returns {boolean} True if `arg` is undefined
 */
var isUndefined = function isUndefined(arg) {
  return typeof arg === 'undefined';
};

module.exports = {
  getDependencies: getDependencies,
  getFiles: getFiles,
  getDirectories: getDirectories,
  loadFiles: loadFiles,
  isFile: isFile,
  isDirectory: isDirectory,
  isArray: isArray,
  isObject: isObject,
  isString: isString,
  isFunction: isFunction,
  isPromise: isPromise,
  isDefined: isDefined,
  isUndefined: isUndefined
};
