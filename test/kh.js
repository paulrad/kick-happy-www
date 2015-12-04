var chai = require('chai')
    assert = chai.assert,
    expect = chai.expect,
    should = chai.should();

require('../sys/kh.js');

describe('KH', function() {

  describe('#version', function() {

    it('should return the version number presents in the package.json configuration file', function() {
      var packageJsonVersion = require('../package.json')['version'];
      return assert.equal(KH.version, packageJsonVersion);
    });

  });

  describe('#utils', function() {

    it('should be an object', function() {
      return assert.isObject(KH.utils);
    });

    describe('#getDependencies', function() {

      it('should be a valid function', function() {
        return assert.isFunction(KH.utils.getDependencies);
      });

      it('should return return an array of registerer dependencies', function() {
        var dependencies = KH.utils.getDependencies('dependencies', false);
        return assert.isObject(dependencies);
      });

    });

  });

  describe('#controller()', function() {

    it('should throw an exception if the file is not present', function() {
      return assert.throws(KH.controller, Error, "Undefined controller reference");
    });

    it('should returns KH if it used as setter', function() {
      var outController = KH.controller({
        method: 'GET',
        path: '/index',
        handler: function(req, reply) {
          reply('hello world');
        }
      });
      return assert.equal(KH, outController);
    });

    it('should returns the handler if it used as getter and the given path is valid', function() {
      var outController = KH.controller('get.index');
      return assert.isFunction(outController);
    });

  });

})