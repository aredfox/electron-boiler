/* ******************************************************************** */
/* MODULE IMPORTS */
const gulp = require('gulp');
const path = require('path');
const moment = require('moment');
const del = require('del');
const ignore = require('gulp-ignore');
const runSequence = require('run-sequence');
const argv = require('yargs').argv;
/* LOCATIONS */
const SOURCE_DIR = path.resolve('./src');
const SOURCE_DATA_DIR = path.resolve('./src/data');
const SOURCE_CONFIG_DIR = path.resolve('./src/data/config');
const SOURCE_RESOURCES_DIR = path.resolve('./src/data/resources');
const SOURCE_VIEWS_DIR = path.resolve('./src/views');
const SOURCE_LIB_DIR = path.resolve('./src/lib');
const SOURCE_STYLES_DIR = path.resolve('./src/styles');
const BUILD_DIR = path.resolve('./app');
/* FILE IMPORTS */
const packagejson = require('./package.json');
/*/********************************************************************///

/* ******************************************************************** */
/* DEBUG TASKS */
const TASK_DEBUG = 'debug';
gulp.task(TASK_DEBUG, cb => {
    log(`Running in '${getEnvironmentName()}'-environment.`);
    cb();
});
/*/********************************************************************///

/* ******************************************************************** */
/* CLEAN TASKS */
const TASK_CLEAN = 'clean';
gulp.task(TASK_CLEAN, cb => {
    runSequence(
        TASK_DEBUG,
        TASK_CLEAN_BUILD_DIR,
        cb
    );    
});
const TASK_CLEAN_BUILD_DIR = `${TASK_CLEAN}:build`;
gulp.task(TASK_CLEAN_BUILD_DIR, cb => {
    const dirglob = `${BUILD_DIR}/**/*`;
    log(`Will now clean with glob '${dirglob}'.`);
    return del([
        `${dirglob}`,
        `!${dirglob}/*.gitkeep`
    ], 
    cb);                    
});
/*/********************************************************************///

/* ******************************************************************** */
/* HELPER ENVIRONMENT METHODS */
function getEnvironmentName() {
    if(isProd()) {
        return "Production";
    }
    return "Development";
}
function isDev() {
    return !isProd();
}
function isProd() {
    return argv.prod;
}
/* HELPER CONSOLE LOG METHODS */
function log(message) {
    console.log(` --> [${getFormattedTime()}] ${message}`);
}
function getFormattedTime() {
    return moment().format('HH:mm:ss');
}
/*/********************************************************************///