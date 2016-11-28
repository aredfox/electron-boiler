'use strict';

/* ******************************************************************** */
/* TASK SPECIFIC IMPORTS */
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* TASK DEBUG */
module.exports = (gulp, plugins) => {
    return () => {        
        gulp.src(plugins.config.paths.src.views.styles)
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.less())
            .pipe(plugins.autoprefixer({browsers: [ 'last 2 Chrome versions' ]})) // Using electron, we only need to autoprefix for chrome
            .pipe(plugins.cssmin())
            .pipe(plugins.rename({ suffix: '.min' }))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest(plugins.config.paths.dest.views.styles));
    };
};
/*/********************************************************************///
/*///*/