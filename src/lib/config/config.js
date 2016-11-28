/* ******************************************************************** */
/* MODULE IMPORTS */
import dot from 'dot-object';
/* FILE IMPORTS */
import packagejson from './../../package.json';
import configjson from './../../data/config/config.json';
/*/********************************************************************///

/* ******************************************************************** */
/* CLASS */
export default class Config {
    constructor() {
        this.environmentName = (configjson.app.build.environment.name || 'development').toLowerCase();
        this.version = `${packagejson.version}-${configjson.app.build.number}`;
        this.commithash = `${configjson.app.build.commit}`;
        this.gitrepo = `${packagejson.repository.url}`;
        this.githubrepolink = `${packagejson.repository.url}/commit/${configjson.app.build.commit}`;
        this.applicationName = packagejson.displayName || packagejson.name || '(*undefined)';
        this.configObject = configjson.config || {};
    }

    // Determines whether this is a production build
    isProd() {
        return this.environmentName === 'production';
    }
    // Determines whether this is a development build
    isDev() {
        return !this.isProd();
    }

    // Determines whether a given key exists
    hasKey(key) {
        return dot.pick(key, this.configObject) !== undefined;
    }
    // Gets a value
    get(key) {
        if(this.hasKey(key)) {
            return dot.pick(key, this.configObject);
        }
        return '(*undefined)';
    }
}
/*/********************************************************************///