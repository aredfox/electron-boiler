'use strict';

/* ******************************************************************** */
/* TASK SPECIFIC IMPORTS */
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* TASK DEBUG */
module.exports = (gulp, plugins) => {
    return () => {        
        return gulp.src(plugins.config.paths.src.views.react)
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.babel())
            .pipe(plugins.concat('app.js'))
            .pipe(plugins.uglify())
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(plugins.config.paths.dest.views.react));
    };
};
/*/********************************************************************///
/*///*/