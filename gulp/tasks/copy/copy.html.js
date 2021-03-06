'use strict';

/* ******************************************************************** */
/* TASK SPECIFIC IMPORTS */
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* TASK DEBUG */
module.exports = (gulp, plugins) => {
    return () => {        
        return gulp.src(plugins.config.paths.src.views.html)                
            .pipe(gulp.dest(plugins.config.paths.dest.views.html)); 
    };
};
/*/********************************************************************///
/*///*/