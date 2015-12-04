var path = require('path');

var gulp = require('gulp'),
    importer = require('gulp-fontello-import'),
    replace = require('gulp-replace'),
    del = require('del');

var SOURCES_PATH = path.join('public', 'assets', 'sources', 'fonts');
var DEST_PATH = path.join('public', 'assets', 'builds', 'fonts');

module.exports.copy = function copy() {
  gulp.src(SOURCES_PATH + '/**/*')
    .pipe(
      gulp.dest(DEST_PATH)
    )
};

module.exports.fontello = function fontello() {

  var CSS_PATH = path.join('public', 'assets', 'sources', 'css', 'fontello');
  var CSS_BUILD_PATH = path.join('public', 'assets', 'builds', 'css', 'fontello');
  var FONTS_PATH = path.join('public', 'assets', 'sources', 'fonts', 'fontello');

  importer.getFont({
    host: 'http://fontello.com',
    config: SOURCES_PATH + '/fontello.conf',
    css: CSS_PATH,
    font: FONTS_PATH
  }, function() {
    gulp.src([
      CSS_PATH + '/fontello.css',
      CSS_PATH + '/animation.css',
    ])
    .pipe(
      replace(/\.\.?\/(fonts?\/?)?/g, '/assets/fonts/fontello/')
    )
    .pipe(
      gulp.dest(CSS_PATH)
    )
  });
};