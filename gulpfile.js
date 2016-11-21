/* ******************************************************************** */
/* MODULE IMPORTS */
const gulp = require('gulp');
const os = require('os');
const md5 = require('md5');
const path = require('path');
const moment = require('moment');
const del = require('del');
const ignore = require('gulp-ignore');
const rename = require('gulp-rename');
const json = require('gulp-json-editor');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const cssmin = require('gulp-cssmin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const argv = require('yargs').argv;
const colors = require('colors/safe');
/* ******************************************************************** */
/* LOCATIONS */
const SOURCE_DIR = path.resolve('./src');
const SOURCE_DATA_DIR = path.resolve('./src/data');
const SOURCE_CONFIG_DIR = path.resolve('./src/data/config');
const SOURCE_RESOURCES_DIR = path.resolve('./src/data/resources');
const SOURCE_VIEWS_DIR = path.resolve('./src/views');
const SOURCE_LIB_DIR = path.resolve('./src/lib');
const SOURCE_STYLES_DIR = path.resolve('./src/styles');
const BUILD_DIR = path.resolve('./app');
const BUILD_DATA_DIR = path.resolve('./app/data');
const BUILD_CONFIG_DIR = path.resolve('./app/data/config');
const BUILD_STYLES_DIR = path.resolve('./app/styles');
/* ******************************************************************** */
/* FILE IMPORTS */
const packagejson = require('./package.json');
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* BUILD TASKS */
const TASK_BUILD = 'build';
gulp.task(TASK_BUILD, cb => {
    logInfo(`Perform BUILD.`);
    runSequence(
        TASK_BUILD_COMPILE,     
        cb
    );    
});
const TASK_BUILD_COMPILE = `${TASK_BUILD}:compile`;
gulp.task(TASK_BUILD_COMPILE, cb => {
    logInfo(`Perform BUILD:COMPILE.`);
    runSequence(
        TASK_DEBUG_START,
        TASK_CLEAN,
        TASK_COMPILE,
        TASK_COPY,
        TASK_DEBUG_DONE,
        cb
    );
});
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* COMPILE TASKS */
const TASK_COMPILE = 'compile';
gulp.task(TASK_COMPILE, cb => {
    runSequence(
        TASK_COMPILE_LESS,     
        cb
    );    
});
const TASK_COMPILE_LESS = `${TASK_COMPILE}:less`;
gulp.task(TASK_COMPILE_LESS, cb => {
    logInfo(`Will grab less files that match '${SOURCE_STYLES_DIR}/**/*.less' and compile to styles.min.css'.`);
    return gulp
        .src(`${SOURCE_STYLES_DIR}/**/*.less`)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                browsers: ['last 2 Chrome versions'] // https://github.com/ai/browserslist#queries
            })
        ]))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))        
        .pipe(gulp.dest(`${BUILD_STYLES_DIR}`));       
});
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* COPY TASKS */
const TASK_COPY = 'copy';
gulp.task(TASK_COPY, cb => {
    runSequence(
        TASK_COPY_CONFIG,     
        cb
    );    
});
const TASK_COPY_CONFIG = `${TASK_COPY}:config`;
gulp.task(TASK_COPY_CONFIG, cb => {
    const configFileName = `config.${getEnvironmentName().toLowerCase()}.json`;
    const configFilePath = path.resolve(`${SOURCE_CONFIG_DIR}/${configFileName}`);
    const buildTimestamp = moment();    
    const buildNumber = buildTimestamp.format('YYYYMMDDHHmmss');  
    const machine = `${os.platform()}:${os.type()}:${os.hostname()}`;  
    logInfo(`Will grab config file '${configFileName}' and inject build parameters: buildNumber '${buildNumber}' / buildTimestamp '${buildTimestamp.format()}' / machine '${machine}'.`);    
    logInfo(`Will grab config file '${configFileName}' as source and output as config.json in '${BUILD_CONFIG_DIR}'.`);
    return gulp
        .src(configFilePath)
        .pipe(rename('config.json'))
        .pipe(json(json => {
            json.build.number = buildNumber;
            json.build.timestamp = buildTimestamp.format();
            json.build.environment.machine = {};
            json.build.environment.machine.id = machine;
            json.build.environment.machine.number = md5(machine);
            return json;
        }, {
            'indent_char': '\t',
            'indent_size': 1
        }))
        .pipe(gulp.dest(`${BUILD_CONFIG_DIR}`));        
});
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* CLEAN TASKS */
const TASK_CLEAN = 'clean';
gulp.task(TASK_CLEAN, cb => {
    runSequence(                
        TASK_CLEAN_BUILD_DIR,                
        cb
    );    
});
const TASK_CLEAN_BUILD_DIR = `${TASK_CLEAN}:build`;
gulp.task(TASK_CLEAN_BUILD_DIR, cb => {
    const dirglob = `${BUILD_DIR}/**/*`;
    logWarning(`Will now clean with glob '${dirglob}'.`);
    return del([
        `${dirglob}`,
        `!${dirglob}/*.gitkeep`
    ], 
    cb);                    
});
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* HELPER ENVIRONMENT METHODS */
function getEnvironmentName() {
    if(isProd()) {
        return `Production`;
    }
    return `Development`;
}
function isDev() {
    return !isProd();
}
function isProd() {
    return argv.prod;
}
/* ******************************************************************** */
/* HELPER PACKAGE JSON METHODS */
function getProjectName() {
    if(packagejson === undefined) {
        logError('No package.json defined');
        throw new Error('No package.json defined');
    }
    if(packagejson['name'] === undefined) {
        logError('No \'name\' property found inside package.json');
        throw new Error('No \'name\' property found inside package.json');
    }
    return packagejson.name;
}
/* ******************************************************************** */
/* HELPER CONSOLE LOG METHODS */
const LOG_DEBUG = 'dbg';
const LOG_INFO = 'inf';
const LOG_WARNING = 'wng';
const LOG_ERROR = 'err';
colors.setTheme({
    thdbg: ['bgBlack', 'grey'],
    thinf: ['bgBlue', 'white'],
    thwng: ['bgYellow', 'black'],
    therr: ['bgRed', 'white']
});
function log(message, type) {    
    type = type || LOG_DEBUG;
    const theme = colors['th'+type]; 
    console.log(theme(` > ${[type.toUpperCase()]} [${getFormattedTime()}] ${message}`));
}
function logInfo(message) { log(message, LOG_INFO); }
function logWarning(message) { log(message, LOG_WARNING); }
function logError(message) { log(message, LOG_ERROR); }
function getFormattedTime() {
    return moment().format('HH:mm:ss');
}
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* DEBUG TASKS */
const TASK_DEBUG = '::debug';
gulp.task(TASK_DEBUG, cb => {
    log(`Running GULP for project '${getProjectName()}' in '${getEnvironmentName()}'-environment.`);
    cb();
});
const TASK_DEBUG_START = '::debug:seq:start';
gulp.task(TASK_DEBUG_START, cb => {
    logInfo(`Signal 'START' running GULP for project '${getProjectName()}' in '${getEnvironmentName()}'-environment.`);
    cb();
});
const TASK_DEBUG_DONE = '::debug:seq:done';
gulp.task(TASK_DEBUG_DONE, cb => {
    logInfo(`Signal 'DONE' running GULP for project '${getProjectName()}' in '${getEnvironmentName()}'-environment.`);
    cb();
});
/*/********************************************************************///
/*///*/