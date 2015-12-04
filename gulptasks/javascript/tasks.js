var CWD = process.cwd();
var path = require('path');

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    Q = require('bluebird'),

    utils = require(CWD + '/sys/utils.js');

var VENDORS_PATH = path.join('public', 'assets', 'builds', 'vendors');
var SOURCES_PATH = path.join('public', 'assets', 'sources', 'js');
var DEST_PATH = path.join('public', 'assets', 'builds', 'js');

var prepareTask = function(directory) {
  return gulp.src([
      SOURCES_PATH + '/' + directory + '/main.js',
      SOURCES_PATH + '/' + directory + '/**/*.js'
    ])
    .pipe(
      jshint()
    )
    .pipe(
      jshint.reporter('jshint-stylish')
    );
};

var defaultTask = function(directory) {
  gulp.src([
      VENDORS_PATH + '/builds.min.js',

      SOURCES_PATH + '/' + directory + '/main.js',
      SOURCES_PATH + '/' + directory + '/**/*.js'
    ])
    //.pipe(sourcemaps.init())
    .pipe(
      uglify()
    )
    .pipe(
      concat('builds.min.js')
    )
    //.pipe(sourcemaps.write('maps/'))
    .pipe(
      gulp.dest(DEST_PATH + '/' + directory)
    )
};


var specificTask = function(specific) {

  var specificDirectory = path.basename(specific);

  gulp.src(specific + '/**/*.js')
    //.pipe(sourcemaps.init())
    .pipe(
      uglify()
    )
    .pipe(
      concat('builds.min.js')
    )
    //.pipe(sourcemaps.write('maps/'))
    .pipe(
      gulp.dest(DEST_PATH + '/specifics/' + specificDirectory)
    )

};

var globals = function globals() {
  //prepareTask('globals');
  defaultTask('globals');
};

var specifics = function specifics() {
  var Promises = [];

  utils.getDirectories(SOURCES_PATH + '/specifics/*').forEach(function(specific) {
    Promises.push(specificTask(specific));
  });

  return Q.all(Promises);
};

module.exports = {
  globals: globals,
  specifics: specifics
};