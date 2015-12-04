var gulp = require('gulp'),
    tasks = require('./tasks.js');

gulp.task('javascript.globals', tasks.globals);
gulp.task('javascript.specifics', tasks.specifics);