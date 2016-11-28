'use strict';

/* ******************************************************************** */
/* TASK SPECIFIC IMPORTS */
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* TASK DEBUG */
module.exports = (gulp, plugins) => {
    return () => {
        for(let vendor of plugins.config.paths.src.vendors) {
            gulp.src(vendor.source)
                .pipe(gulp.dest(`${plugins.config.paths.dest.vendor}/${vendor.name}`));
        };         
    };
};
/*/********************************************************************///
/*///*/