'use strict';

/* ******************************************************************** */
/* MODULE IMPORTS */
const gulp = require('gulp');
const argv = require('yargs').argv;
const runSequence = require('run-sequence');
const config = require('./gulp/gulpfile.config');
const plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-clean-css': 'cleancss'
    }
});
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* CONFIGURE PLUGINS */
plugins.config = config(argv);
plugins.del = require('del');
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* CONFIGURE TASKS */
// Helper function to get tasks
function getTask(category, name) {
    return require(`./gulp/tasks/${category}/${category}.${name}`)(gulp, plugins);
}
// Debug 
gulp.task('debug:config', getTask('debug', 'config'));
gulp.task('debug:plugins', getTask('debug', 'plugins'));
// Styles
gulp.task('styles:compile', getTask('styles', 'compile'));
// React (JS/JSX Views)
gulp.task('js:jsx', getTask('js', 'jsx'));
// Build
gulp.task('build:clean', getTask('build', 'clean'));
gulp.task('build', ['build:clean'], cb => {
    runSequence(
        'styles:compile',
        cb
    );        
});
// Watch
gulp.task('watch', ['build'], () => {
    gulp.watch(config.paths.src.views.styles, ['styles:compile']);
});
/*/********************************************************************///
/*///*/