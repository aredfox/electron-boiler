/* ******************************************************************** */
/* MODULE IMPORTS */
/* FILE IMPORTS */
import packagejson from './../../package.json';
import configjson from './../../data/config/config.json';
/*/********************************************************************///

/* ******************************************************************** */
/* CLASS */
export default class Config {
    constructor() {
        this.environmentName = configjson.build.environment.name;
        this.version = `${packagejson.version}-${configjson.build.number}`;
        this.applicationName = packagejson.displayName || packagejson.name || 'electron-boiler-(*undefined)';
    }
}
/*/********************************************************************///