'use strict';

/* ******************************************************************** */
/* MODULE IMPORTS */
const gulp = require('gulp');
const childProcess = require('child_process');
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
// Lib compile
gulp.task('js:main:compile', getTask('js', 'main'));
gulp.task('lib:compile', getTask('lib', 'compile'));
// Copy
gulp.task('copy', ['copy:data', 'copy:html', 'copy:vendor']);
gulp.task('copy:html', getTask('copy', 'html'));
gulp.task('copy:data', getTask('copy', 'data'));
gulp.task('copy:vendor', getTask('copy', 'vendor'));
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
        'lib:compile',
        'js:main:compile',
        'styles:compile', 
        'views:jsx:compile',
        cb
    );        
});
// Watch
gulp.task('electronwatch', cb => {
    gulp.watch(plugins.config.paths.src.views.styles, ['styles:compile']);    
    gulp.watch(plugins.config.paths.src.views.html, ['copy:html']);
    gulp.watch(plugins.config.paths.src.views.react, ['views:jsx:compile']);    
    gulp.watch(`${plugins.config.paths.src.data}/**/*`, ['copy:data']);
    gulp.watch(`${plugins.config.paths.src.data}/config/**/*`, ['config:app']);
    runElectron();
});
// Helper method to run electron
let electronProcess;
function runElectron() {    
    let electronPath = "./node_modules/electron/dist/electron";
    const electronParameters = ["app/main.js"];
    if (process.platform === 'darwin') {
        electronPath = `${electronPath}.app/Contents/MacOS/Electron`;
    }

    function startElectron() {
        electronProcess = childProcess.spawn(electronPath, electronParameters);
        electronProcess.stdout.pipe(process.stdout);
        electronProcess.on('close', (code, signal) => {            
            console.log('Electron stopped...');
            console.log(`  .....code: '${code}'`);
            console.log(`  ...signal: '${signal}'`);
            electronProcess.kill();
            process.exit();
        });
    }

    return startElectron();
}
/*/********************************************************************///
/*///*/