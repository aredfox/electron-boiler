'use strict';

/* ******************************************************************** */
/* IMPORTS */
/*/********************************************************************///
/*///*/

/* ******************************************************************** */
/* CONFIG OBJECT */
module.exports = argv => {
    return {
        env: {
            id: argv.prod ? 'prod' : 'dev',
            name: argv.prod ? 'production' : 'development',            
            isProd: !argv.prod ? false : true,
            isDev: !argv.prod
        },
        paths: {
            tasks: './gulp/tasks',
            src: {
                base: './src',
                main: './src/main.js',
                config: './src/data/config',
                data: './src/data',
                views: {
                    html: './src/views/*.html',
                    react: './src/views/*.{js,jsx}',
                    styles: './src/views/styles/*.{less,css}' 
                },
                lib: './src/lib/**/*.js',
                vendors: [
                    {
                        source: './node_modules/font-awesome/**/*.{min.css,otf,eot,svg,ttf,woff,woff2}',
                        name: 'font-awesome'
                    }                    
                ],
            },
            dest: {
                base: './app',
                config: './app/data/config',
                data: './app/data',
                views: {
                    html: './app/views',
                    react: './app/views',
                    styles: './app/views/styles' 
                },
                lib: './app/lib',
                vendor: './app/lib/vendor'
            }
        }
    };
};
/*/********************************************************************///
/*///*/