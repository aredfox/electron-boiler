'use strict';

/* ******************************************************************** */
/* TASK SPECIFIC IMPORTS */
const packagejson = require('../../../package.json');
const moment = require('moment');
const md5 = require('md5');
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* TASK DEBUG */
module.exports = (gulp, plugins) => {
    const buildTimestamp = moment();
    const buildNumber = buildTimestamp.format('YYYYMMDDHHmmss');
    const machine = `${plugins.os.platform()}:${plugins.os.type()}:${plugins.os.hostname()}`;

    return () => {                                        
        gulp.src(`${plugins.config.paths.src.config}/config.${plugins.config.env.name}.json`)
            .pipe(plugins.rename('config.json'))
            .pipe(plugins.jsoneditor(json => {                    
                json.app.name = _getProjectName();
                json.app.version = _getProjectVersion();            
                json.app.build.number = buildNumber;
                json.app.build.timestamp = buildTimestamp.format();
                json.app.build.commit = _getCommitHash();
                json.app.build.environment.id = plugins.config.env.id;
                json.app.build.environment.name = plugins.config.env.name;                
                json.app.build.environment.machine = {};
                json.app.build.environment.machine.id = machine;
                json.app.build.environment.machine.number = md5(machine);            
                return json;
        }, {
            'indent_char': '\t',
            'indent_size': 1
        }))
        .pipe(gulp.dest(plugins.config.paths.dest.config)); 
    };    
};

function _getCommitHash() {
    try {
        return childProcess.execSync('git rev-parse HEAD').toString().trim();
    } catch(err) {        
        return -1;        
    }
}
function _getProjectName() {
    if(packagejson === undefined) {        
        throw new Error('No package.json defined');
    }
    if(packagejson['name'] === undefined) {        
        throw new Error('No \'name\' property found inside package.json');
    }
    return packagejson.name;
}
function _getProjectVersion() {
    if(packagejson === undefined) {        
        throw new Error('No package.json defined');
    }
    if(packagejson['version'] === undefined) {        
        throw new Error('No \'name\' property found inside package.json');
    }
    return packagejson.version;
}
/*/********************************************************************///
/*///*/