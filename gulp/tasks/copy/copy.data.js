'use strict';

/* ******************************************************************** */
/* TASK SPECIFIC IMPORTS */
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* TASK DEBUG */
module.exports = (gulp, plugins) => {
    return () => {        
        return gulp.src([
                `${plugins.config.paths.src.data}/**/*`,
                `!${plugins.config.paths.src.data}/config/**`
            ])                
            .pipe(gulp.dest(plugins.config.paths.dest.data)); 
    };
};
/*/********************************************************************///
/*///*/