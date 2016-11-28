/* ******************************************************************** */
/* MODULE IMPORTS */
const fs = require('fs');
const childProcess = require('child_process');
const gulp = require('gulp');
const watch = require('gulp-watch');
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
const relativeSourcemapsSource = require('gulp-relative-sourcemaps-source');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
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
const BUILD_VIEWS_DIR = path.resolve('./app/views');
const BUILD_LIB_DIR = path.resolve('./app/lib');
const BUILD_STYLES_DIR = path.resolve('./app/styles');
const BUILD_ARTIFACTS = './_buildartifacts';
const BUILD_SOURCEMAPS_JS_DIR = './_buildartifacts/maps/js';
const BUILD_SOURCEMAPS_STYLES_DIR = './_buildartifacts/maps/js';
const BUILD_VENDOR_DIR = './app/vendor/';
/* ******************************************************************** */
/* FILE IMPORTS */
const packagejson = require('./package.json');
/* ELECTRON */
let electronStopping = false;
let electronProcess = null;
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
/* WATCH TASKS */
const TASK_WATCH = 'watch';
gulp.task(TASK_WATCH, ['run', 'watchers']);
gulp.task('run', () => {
    logInfo('Starting electron...');
    return runElectron();
});
gulp.task('watchers', () => {
    logInfo('Starting watch for all changes...');
    return watch('src/**/*', vinyl => {
        let handled = false;
        logChange(`${vinyl.event.toUpperCase()} @ '${vinyl.path}'.`);

        /*if(hasChanged(vinyl.path, vinyl.path.replace('src/', 'app/'))) {*/
            if(vinyl.path.endsWith('.js') || vinyl.path.endsWith('.jsx')) {
                handled = true;
                logChange(`Detected js/jsx thus running full compile.`);
                runSequence(TASK_COMPILE);            
            }
            if(vinyl.path.endsWith('.less') && !handled) {
                handled = true;
                logChange(`Detected less thus running css/style build.`);
                runSequence(TASK_COMPILE_LESS);            
            }
            if(vinyl.path.indexOf('src/data/') !== -1 && !handled) {
                handled = true;
                logChange(`Detected data folder thus running copy.`);
                runSequence(TASK_COPY);            
            }
            if(!handled) {
                handled = true;
                logChange(`Detected not handled thus running full build.`);
                runSequence(TASK_BUILD);            
            }
        /*}*/

        logChange(`${vinyl.event.toUpperCase()} @ '${vinyl.path}'.`);        
    });
});
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* COMPILE TASKS */
const TASK_COMPILE = 'compile';
gulp.task(TASK_COMPILE, cb => {
    runSequence(
        TASK_COMPILE_LESS, 
        TASK_COMPILE_JS_VIEWS, 
        TASK_COMPILE_JS_LIB,
        TASK_COMPILE_JS_MAIN,   
        cb
    );    
});
const TASK_COMPILE_LESS = `${TASK_COMPILE}:less`;
gulp.task(TASK_COMPILE_LESS, cb => {
    logInfo(` |LESS| Will grab less files that match '${SOURCE_STYLES_DIR}/**/*.less' and compile to styles.min.css'.`);
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
        .pipe(relativeSourcemapsSource({dest: BUILD_STYLES_DIR}))
        .pipe(sourcemaps.write(BUILD_SOURCEMAPS_STYLES_DIR))        
        .pipe(gulp.dest(`${BUILD_STYLES_DIR}`));       
});
const TASK_COMPILE_JS_VIEWS = `${TASK_COMPILE}:js:views`;
gulp.task(TASK_COMPILE_JS_VIEWS, cb => {
    const glob = [
        `${SOURCE_DIR}/views/**/*.{js,jsx}`
        ,`!${SOURCE_DIR}/main.js` // mains.js ignored as it needs it's own file
    ];
    logInfo(` |JSVIEWS-JS/JSX| Will grab all files matching the pattern '${glob}' and copy them to '${BUILD_VIEWS_DIR} as 'app.js'.`);
    return gulp
        .src(glob)
        .pipe(sourcemaps.init())
        .pipe(babel()) // configured in .babelrc
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(relativeSourcemapsSource({dest: BUILD_VIEWS_DIR}))
        .pipe(sourcemaps.write(BUILD_SOURCEMAPS_JS_DIR))
        .pipe(gulp.dest(`${BUILD_VIEWS_DIR}`));        
});
const TASK_COMPILE_JS_LIB = `${TASK_COMPILE}:js:lib`;
gulp.task(TASK_COMPILE_JS_LIB, cb => {
    const glob = [
        `${SOURCE_DIR}/lib/**/*.js`        
    ];
    logInfo(` |JSLIB-JS| Will grab all files matching the pattern '${glob}' and copy them to '${BUILD_LIB_DIR}.`);
    return gulp
        .src(glob)
        .pipe(sourcemaps.init())
        .pipe(babel()) // configured in .babelrc        
        .pipe(uglify())
        .pipe(relativeSourcemapsSource({dest: BUILD_LIB_DIR}))
        .pipe(sourcemaps.write(BUILD_SOURCEMAPS_JS_DIR))
        .pipe(gulp.dest(`${BUILD_LIB_DIR}`));        
});
const TASK_COMPILE_JS_MAIN = `${TASK_COMPILE}:js:main`;
gulp.task(TASK_COMPILE_JS_MAIN, cb => {
    const glob = [        
        ,`${SOURCE_DIR}/main.js` // mains.js needs it's own file
    ];
    logInfo(` |JSMAIN-main.js| Will grab all files matching the pattern '${glob}' and copy them to '${BUILD_DIR} as 'app.js'.`);
    return gulp
        .src(glob)
        .pipe(sourcemaps.init())
        .pipe(babel()) // configured in .babelrc        
        .pipe(uglify())
        .pipe(relativeSourcemapsSource({dest: BUILD_DIR}))
        .pipe(sourcemaps.write(BUILD_SOURCEMAPS_JS_DIR))
        .pipe(gulp.dest(`${BUILD_DIR}`));        
});
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* COPY TASKS */
const TASK_COPY = 'copy';
gulp.task(TASK_COPY, cb => {
    runSequence(
        TASK_COPY_PACKAGEJSON,
        TASK_COPY_CONFIG,
        TASK_COPY_DATA,
        TASK_COPY_VIEWS_HTML,
        TASK_COPY_VENDOR_FONTAWESOME,
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
    logInfo(` |CONFIG.JSON| Will grab config file '${configFileName}' and inject build parameters: commit '${getCommitHash()}' / buildNumber '${buildNumber}' / buildTimestamp '${buildTimestamp.format()}' / machine '${machine}'.`);    
    logInfo(` |CONFIG.JSON| Will grab config file '${configFileName}' as source and output as config.json in '${BUILD_CONFIG_DIR}'.`);
    return gulp
        .src(configFilePath)
        .pipe(rename('config.json'))
        .pipe(json(json => {
            json.build.number = buildNumber;
            json.build.timestamp = buildTimestamp.format();
            json.build.commit = getCommitHash();
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
const TASK_COPY_PACKAGEJSON = `${TASK_COPY}:packagejson`;
gulp.task(TASK_COPY_PACKAGEJSON, cb => {      
    logInfo(` |PACKAGE.JSON| Will grab package.json and clean it out.`);        
    return gulp
        .src('./package.json')        
        .pipe(json(json => {
            // delete json.repository; // uncomment this when you don't want to share the repo
            json.main = "main.js";
            delete json.scripts;
            delete json.devDependencies;     
            delete json.build;       
            return json;
        }, {
            'indent_char': '\t',
            'indent_size': 1
        }))
        .pipe(gulp.dest(`${BUILD_DIR}`));        
});
const TASK_COPY_DATA = `${TASK_COPY}:resources`;
gulp.task(TASK_COPY_DATA, cb => {
    const glob = [`${SOURCE_DATA_DIR}/**/*`, `!${SOURCE_DATA_DIR}/config/**/*`];            
    logInfo(` |DATA| Will grab all files matching the pattern '${glob}' and copy them to '${BUILD_DATA_DIR}.`);
    return gulp
        .src(glob)                
        .pipe(gulp.dest(`${BUILD_DATA_DIR}`));        
});
const TASK_COPY_VIEWS_HTML = `${TASK_COPY}:views:html`;
gulp.task(TASK_COPY_VIEWS_HTML, cb => {
    const glob = `${SOURCE_VIEWS_DIR}/**/*.{htm,html}`;            
    logInfo(` |HTM/HTML| Will grab all files matching the pattern '${glob}' and copy them to '${BUILD_VIEWS_DIR}.`);
    return gulp
        .src(glob)                
        .pipe(gulp.dest(`${BUILD_VIEWS_DIR}`));        
});
const TASK_COPY_VENDOR_FONTAWESOME = `${TASK_COPY}:vendor:font-awesome`;
gulp.task(TASK_COPY_VENDOR_FONTAWESOME, cb => {
    const glob = `./node_modules/font-awesome/**/*.{min.css,otf,eot,svg,ttf,woff,woff2}`;            
    logInfo(` |VENDOR/FONT-AWESOME| Will grab all files matching the pattern '${glob}' and copy them to '${BUILD_VENDOR_DIR}.`);
    return gulp
        .src(glob)                
        .pipe(gulp.dest(`${BUILD_VENDOR_DIR}/font-awesome`));        
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
function getCommitHash() {
    try {
        return childProcess.execSync('git rev-parse HEAD').toString().trim();
    } catch(err) {
        logError(`Not able to fetch latest commit hash: "${err}". Returning "-1".`);
        return -1;        
    }
}
function runElectron() {
    electronStopping = false;
    electronProcess = null;
    let electronPath = "./node_modules/electron/dist/electron";
    let electronParameters = ["app/main.js"];
    if (process.platform === 'darwin') {
        electronPath = `${electronPath}.app/Contents/MacOS/Electron`;
    }

    function startElectron() {
        electronProcess = childProcess.spawn(electronPath, electronParameters);
        electronProcess.stdout.pipe(process.stdout);
        electronProcess.on('close', (code, signal) => {
            electronStopping = true;
            logInfo('Electron stopped...');
            log(`  .....code: '${code}'`);
            log(`  ...signal: '${signal}'`);
            electronProcess.kill();
            process.exit();
        });
    }

    return startElectron();
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
const LOG_CHANGE = 'chg';
colors.setTheme({
    thdbg: ['bgBlack', 'grey'],
    thinf: ['bgBlue', 'white'],
    thwng: ['bgYellow', 'black'],
    therr: ['bgRed', 'white'],
    thchg: ['bgMagenta', 'white']
});
function log(message, type) {    
    type = type || LOG_DEBUG;
    const theme = colors['th'+type]; 
    console.log(theme(` > ${[type.toUpperCase()]} [${getFormattedTime()}] ${message}`));
}
function logInfo(message) { log(message, LOG_INFO); }
function logWarning(message) { log(message, LOG_WARNING); }
function logError(message) { log(message, LOG_ERROR); }
function logChange(message) { log(message, LOG_CHANGE); }
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