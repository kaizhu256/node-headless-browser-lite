#!/usr/bin/env node
/*jslint
    evil: true,
    maxerr: 8,
    maxlen: 96,
    node: true,
    nomen: true,
*/
(function (self) {
    'use strict';
    var local;



    // run shared js-env code
    (function () {
        // init local
        local = {};
        local.modeJs = (function () {
            try {
                return self.phantom.version &&
                    typeof require('webpage').create === 'function' &&
                    'phantom';
            } catch (errorCaughtPhantom) {
                return module.exports &&
                    typeof process.versions.node === 'string' &&
                    typeof require('http').createServer === 'function' &&
                    'node';
            }
        }());
    }());
    switch (local.modeJs) {



    // run node js-env code
    case 'node':
        module.exports = require('./package.json');
        module.exports.__dirname = __dirname;
        module.exports.processSpawn = function (arg0, argList, options) {
            arg0 = arg0 || process.argv[2];
            argList = argList || process.argv.slice(3);
            options = options || { stdio: [0, 1, 2] };
            //!! // http://docs.slimerjs.org/current/installation.html#configuring-slimerjs
            //!! process.env.SLIMERJSLAUNCHER = process.env.SLIMERJSLAUNCHER ||
                //!! process.platform === 'darwin'
                //!! ? '/Applications/Firefox.app/Contents/MacOS/firefox'
                //!! : '/usr/bin/firefox';
            switch (argList[0]) {
            case 'eval':
            case 'evalWithoutExit':
                require('child_process').spawn(
                    __dirname + '/' + arg0,
                    [__filename].concat(argList),
                    options
                );
                break;
            default:
                require('child_process').spawn(__dirname + '/' + arg0, argList, options);
            }
        };
        // run main module
        if (module === require.main) {
            module.exports.processSpawn();
        }
        break;



    // run phantom js-env code
    case 'phantom':
        // require modules
        local.system = require('system');
        switch (local.system.args[1]) {
        case 'eval':
            try {
                eval(local.system.args[2]);
            } catch (errorCaught) {
                console.error(errorCaught.stack);
            }
            self.phantom.exit();
            break;
        case 'evalWithoutExit':
            eval(local.system.args[2]);
            break;
        default:
            self.phantom.exit();
            break;
        }
        break;
    }
}(this));
