'use strict';

/* ******************************************************************** */
/* CONFIG OBJECT */
module.exports = {
    paths: {
        tasks: './gulp/tasks',
        src: {
            base: './src',
            views: {
                html: './src/views/*.html',
                react: './src/views/*.{js,jsx}',
                styles: './src/views/styles/*.{less,css}' 
            },
            lib: './src/lib',            
        },
        dest: {
            base: './app',
            views: {
                html: './app/views',
                react: './app/views',
                styles: './app/views/styles' 
            },
            lib: './app/lib',
        }
    }
};
/*/********************************************************************///
/*///*/