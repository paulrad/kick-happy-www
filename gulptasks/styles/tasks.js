var CWD = process.cwd();

var gulp = require('gulp'),
    csso = require('gulp-csso'),
    concatCss = require('gulp-concat-css'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    path = require('path'),
    Q = require('bluebird')

    utils = require(CWD + '/sys/utils.js');

var VENDORS_PATH = path.join('public', 'assets', 'builds', 'vendors');
var SOURCES_PATH = path.join('public', 'assets', 'sources', 'css');
var DEST_PATH = path.join('public', 'assets', 'builds', 'css');

var specificTask = function(specific) {

  var specificDirectory = path.basename(specific);

  gulp.src(specific + '/**/*.scss')
    .pipe(
      sass()
    )
    .pipe(
      csso()
    )
    .pipe(
      autoprefixer()
    )
    .pipe(
      concatCss('builds.min.css')
    )
    .pipe(
      minifyCss()
    )
    .pipe(
      gulp.dest(DEST_PATH + '/specifics/' + specificDirectory)
    )
};

var specifics = function specifics() {
  var Promises = [];

  utils.getDirectories(SOURCES_PATH + '/specifics/*').forEach(function(specific) {
    Promises.push(specificTask(specific));
  });

  return Q.all(Promises);
};

var globals = function globals() {
  gulp.src([
      VENDORS_PATH + '/builds.min.css',
      SOURCES_PATH + '/fontello/fontello.css',
      SOURCES_PATH + '/fontello/animation.css',
      SOURCES_PATH + '/icomoon/style.css',
      SOURCES_PATH + '/webfonts/fonts.css',
      SOURCES_PATH + '/globals/**/*.scss'
    ])
    .pipe(
      sass()
    )
    .pipe(
      concatCss('builds.min.css')
    )
    .pipe(
      csso()
    )
    .pipe(
      autoprefixer()
    )
    .pipe(
      minifyCss()
    )
    .pipe(
      gulp.dest(DEST_PATH + '/globals')
    )
};

module.exports = {
  globals: globals,
  specifics: specifics
};
