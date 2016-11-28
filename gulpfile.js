'use strict';

/* ******************************************************************** */
/* MODULE IMPORTS */
const gulp = require('gulp');
const argv = require('yargs').argv;
const runSequence = require('run-sequence');
const config = require('./gulp/gulpfile.config');
const plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-clean-css': 'cleancss',
        'gulp-json-editor': 'jsoneditor'
    }
});
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* CONFIGURE PLUGINS */
plugins.config = config(argv);
plugins.del = require('del');
plugins.os = require('os');
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
// Views (JS/JSX Views/ Html)
gulp.task('views:jsx:compile', getTask('js', 'jsx'));
// Copy
gulp.task('copy', ['copy:data', 'copy:html']);
gulp.task('copy:html', getTask('copy', 'html'));
gulp.task('copy:data', getTask('copy', 'data'));
// Configuration
gulp.task('config', ['config:app', 'config:projectjson']);
gulp.task('config:app', getTask('config', 'app'));
gulp.task('config:projectjson', getTask('config', 'projectjson'));
// Build
gulp.task('clean', getTask('build', 'clean'));
gulp.task('build:clean', getTask('build', 'clean'));
gulp.task('build', cb => {
    runSequence(
        'build:clean', 
        'copy',
        'config',      
        'styles:compile', 
        'views:jsx:compile',
        cb
    );        
});
// Watch
gulp.task('watch', ['build'], () => {
    gulp.watch(config.paths.src.views.styles, ['styles:compile']);
});
/*/********************************************************************///
/*///*/