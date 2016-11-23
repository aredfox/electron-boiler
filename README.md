# Electron Boiler (electron-boiler)
 
<img align="left" src="https://raw.githubusercontent.com/aredfox/electron-boiler/master/src/data/resources/build/icon.png" width="80" height="80" style="margin-right: 16px"> Opinionated electron.atom.io boilerplate / template that incorporates _less_, _react_ (w/ es2015/react plugins of _babel_). Using _gulp_ as the main task runner.
<p style="clear: both">
<br/>

---

<br/>

## Get started

### Prerequisites

Make sure you have [**node and npm**](https://nodejs.org/en/download/) installed on your machine. It's also handy to have [**gulp**](http://gulpjs.com/) installed globally (use `npm install gulp -g` to install) as the build process relies on this.

### Ok, I have those prerequisites, now what?

1. Open a terminal or console and execute the following command to clone the boilerplate and create a new repo with your own project name.

   ```
   git clone https://github.com/aredfox/electron-boiler my-electron-project
   ```

2. Then navigate via your terminal or console to the project folder and execute the following command to install the needed npm modules.

   ```
   npm install
   ```
    
3. To run the application (in "dev" mode) use the following command.

    ```
    npm start
    ```

    _TIP: run command "`npm install && npm start`" to combine steps 2 and 3._


## Development

Open your favourite code editor and run `npm run dev` to edit & view live changes in your application.

## Packaging/Deployment

Packaging is done via the [**electron-builder**](https://github.com/electron-userland/electron-builder#readme) project, and basic setup has been made via npm scripts that are configure in the _build_ and _directories_ sections in _package.json_. Run the scripts below to build for a given platform, and read through the [**electron-builder**](https://github.com/electron-userland/electron-builder#readme) documentation to tweak the building process (e.g.: include installers).

* `npm package-win`
* `npm package-linux`
* `npm package-mac`
</p>