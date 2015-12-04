var CWD = process.cwd();
var path = require('path');

var gulp = require('gulp'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    libs = require('bower-files')(),
    Q = require('bluebird'),

    utils = require(CWD + '/sys/utils.js');

var SOURCES_PATH = path.join('public', 'assets', 'sources', 'vendors');
var DEST_PATH = path.join('public', 'assets', 'builds', 'vendors');

var vendorsCss = function vendorsCss(files) {
  console.log('run vendors css');
  return new Q.Promise(function(resolve, reject) {
    gulp.src(files)
    .pipe(
      concatCss('builds.min.css')
    )
    .pipe(
      minifyCss()
    )
    .pipe(
      gulp.dest(DEST_PATH)
    )
  });
};

var vendorsJs = function vendorsJs(files) {
  console.log('run vendors js');
  return new Q.Promise(function(resolve, reject) {
    gulp.src(files)
    .pipe(
      concat('builds.min.js')
    )
    .pipe(
      uglify()
    )
    .pipe(
      gulp.dest(DEST_PATH)
    )
  });
};

var vendors = function vendors() {
  return Q.all([
    vendorsCss(libs.ext('css').files),
    vendorsJs(libs.ext('js').files)
  ]);
};

module.exports = {
  vendors: vendors
};
