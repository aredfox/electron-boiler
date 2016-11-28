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
    return () => {                                        
        gulp.src('./package.json')        
            .pipe(plugins.jsoneditor(json => {
            // delete json.repository; // uncomment this when you don't want to share the repo
            json.main = "main.js";
            delete json.scripts;
            delete json.devDependencies;     
            delete json.build;   
            delete json.directories;    
            return json;
        }, {
            'indent_char': '\t',
            'indent_size': 1
        }))
        .pipe(gulp.dest(plugins.config.paths.dest.base));  
    };    
};
/*/********************************************************************///
/*///*/