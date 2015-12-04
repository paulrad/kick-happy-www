var gulp = require('gulp'),
    tasks = require('./tasks.js');

gulp.task('fonts.fontello', tasks.fontello);
gulp.task('fonts.webfonts', tasks.webfonts);
gulp.task('fonts', tasks.copy);