var CWD = process.cwd();
var path = require('path');

var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    glivereload = require('gulp-livereload'),
    gutil = require('gulp-util'),
    gwatch = require('gulp-watch');

var VIEWS_PATH = path.join(CWD, 'public', 'views') + '/';
var SOURCES_PATH = path.join(CWD, 'public', 'assets', 'sources') + '/';
var BUILDS_PATH = path.join(CWD, 'public', 'assets', 'builds') + '/';

var reloadFile = function(event, dir) {
  var filename = path.basename(event.path);
  gutil.log("Changed build file", filename, event.path);
  glivereload.changed(path.join(dir + '/', filename));
};

module.exports.watch = function watch() {

  glivereload.listen();

  gwatch(SOURCES_PATH + 'riot/**/*.tag', function() {
    runSequence('riot')
  });

  gwatch(SOURCES_PATH + 'js/globals/**/*.js', function() {
    runSequence('javascript.globals')
  });

  gwatch(SOURCES_PATH + 'js/specifics/**/*.js', function() {
    runSequence('javascript.specifics')
  });

  gwatch(SOURCES_PATH + 'css/includes/**/*.scss', function() {
    runSequence('styles.globals')
  });

  gwatch(SOURCES_PATH + 'css/globals/**/*.scss', function() {
    runSequence('styles.globals')
  });

  gwatch(SOURCES_PATH + 'css/fontello/**/*.scss', function() {
    runSequence('styles.globals')
  });

  gwatch(SOURCES_PATH + 'css/specifics/**/*.scss', function() {
    runSequence('styles.specifics')
  });

  gwatch(VIEWS_PATH + '**/*', function(event) {
    reloadFile(event, '/');
  });

  gwatch(BUILDS_PATH + 'images/**/*', function(event) {
    reloadFile(event, '/assets/images');
  });

  gwatch(BUILDS_PATH + 'videos/**/*', function(event) {
    reloadFile(event, '/assets/videos');
  });

  gwatch(BUILDS_PATH + 'fonts/**/*', function(event) {
    reloadFile(event, '/assets/fonts');
  });

  gwatch(BUILDS_PATH + 'js/**/*.js', function(event) {
    reloadFile(event, '/assets/js');
  });

  gwatch(BUILDS_PATH + 'riot/**/*.tag', function(event) {
    reloadFile(event, '/assets/riot');
  });

  gwatch(BUILDS_PATH + 'css/specifics/**/*.css', function(event) {
    var spath = event.path.split('/');
    var path = spath[ spath.length - 2 ];
    reloadFile(event, '/assets/specifics/' + path);
  });

  gwatch(BUILDS_PATH + 'css/globals/**/*.css', function(event) {
    reloadFile(event, '/assets/css');
  });

  gwatch(BUILDS_PATH + 'css/specifics/**/*.js', function(event) {
    var spath = event.path.split('/');
    var path = spath[ spath.length - 2 ];
    reloadFile(event, '/assets/specifics/' + path);
  });

  gwatch(BUILDS_PATH + 'css/globals/**/*.js', function(event) {
    reloadFile(event, '/assets/js');
  });

};