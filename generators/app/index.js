"use strict";
var yosay = require('yosay');
var generators = require('yeoman-generator');
var chalk = require('chalk');
/**
 * @module FireLoopGenerator [FireLoop]
 * @author Jonathan Casarrubias <t: johncasarrubias, gh:mean-expert-official>
 * @description
 * This module generates and configure a FireLoop Server
 */
module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
        this.log(yosay('Welcome to FireLoop! \n The MEAN Stack Platform by MEAN Expert'));
    },
    prompting: function () {
        var keys = {
            GENERATE_PROJECT: 'Generate FireLoop Project',
            GENERATE_CLIENT: 'Generate Angular2 Client',
            GENERATE_SDK: 'Generate Angular2 SDK',
            FIRELOOP_VERSION: 'Show FireLoop Version'
        };
        var sharedPaths = {
            web: 'src/app/shared/sdk',
            nativescript: 'src/app/shared/sdk',
            ionic: 'src/app/shared/sdk'
        };
        var clients = this.config.get('clients');
        var choices = new Array();
        if (!this.config.get('version')) {
            choices.push(keys.GENERATE_PROJECT);
        }
        if (this.config.get('version')) {
            choices.push(keys.GENERATE_CLIENT);
        }
        if (typeof clients === 'object' && Object.keys(clients).length > 0) {
            choices.push(keys.GENERATE_SDK);
        }
        choices.push(keys.FIRELOOP_VERSION);
        return this.prompt([{
                type: 'list',
                name: 'list',
                message: 'What do you want to do?',
                default: 0,
                choices: choices
            }]).then(function (answers) {
            var _this = this;
            var done = this.async();
            var answer = answers.list;
            switch (answer) {
                case keys.GENERATE_PROJECT:
                    this.composeWith('fireloop:server').on('end', function () {
                        _this.config.set('version', require('../../package.json').version);
                        _this.composeWith('fireloop:setup').on('end', function () { return done(); });
                    });
                    break;
                case keys.GENERATE_CLIENT:
                    this.composeWith('fireloop:ng2').on('end', function () {
                        done();
                    });
                    break;
                case keys.GENERATE_SDK:
                    this.prompt([{
                            type: 'list',
                            name: 'client',
                            message: 'For which application do you want to build an SDK?',
                            default: 0,
                            choices: Object.keys(clients)
                        }]).then(function (answers) {
                        this.composeWith('fireloop:sdk', {
                            options: {
                                clientPath: clients[answers.client].path + "/" + sharedPaths[clients[answers.client].type],
                                type: clients[answers.client].type
                            }
                        });
                    }.bind(this));
                    break;
                case keys.FIRELOOP_VERSION:
                    var version = require('../../package.json').version;
                    this.log(chalk.blue("\nFireLoop Version: " + version + "\n"));
                    break;
            }
        }.bind(this));
    }
});
//# sourceMappingURL=/Volumes/HD710M/development/www/mean.expert/fireloop.io/generator-fireloop/src/app/index.js.map