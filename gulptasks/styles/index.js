var gulp = require('gulp'),
    tasks = require('./tasks.js');

gulp.task('styles.globals', tasks.globals);
gulp.task('styles.specifics', tasks.specifics);