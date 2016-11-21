/* ******************************************************************** */
/* MODULE IMPORTS */
const gulp = require('gulp');
const path = require('path');
const moment = require('moment');
/* LOCATIONS */
const SOURCE_DIR = path.resolve('./src');
const SOURCE_DATA_DIR = path.resolve('./src/data');
const SOURCE_CONFIG_DIR = path.resolve('./src/data/config');
const SOURCE_RESOURCES_DIR = path.resolve('./src/data/resources');
const SOURCE_VIEWS_DIR = path.resolve('./src/views');
const SOURCE_LIB_DIR = path.resolve('./src/lib');
const SOURCE_STYLES_DIR = path.resolve('./src/styles');
const BUILD_DIR = path.resolve('./app');
/* PATTERNS, GLOBS, ETC */
const ignoreFiles = ['*.gitkeep'];
/* FILE IMPORTS */
const packagejson = require('./package.json');
/*/********************************************************************///

/* ******************************************************************** */
/* DEBUG TASKS */
const TASK_DEBUG = 'debug';
gulp.task(TASK_DEBUG, () => {    
});
/*/********************************************************************///

/* ******************************************************************** */
/* HELPER CONSOLE LOG METHODS */
function log(message) {
    console.log(` ** [${getFormattedTime()}] ${message}`);
}
function getFormattedTime() {
    return moment().format('HH:mm:ss');
}
/*/********************************************************************///