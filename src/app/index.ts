declare var module: any;
declare var require: any;
var yosay = require('yosay');
var generators = require('yeoman-generator');
import * as chalk from 'chalk';
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

    let keys: any = {
      GENERATE_PROJECT: 'Generate FireLoop Project',
      GENERATE_CLIENT: 'Generate Angular2 Client',
      GENERATE_SDK: 'Generate Angular2 SDK',
      FIRELOOP_VERSION: 'Show FireLoop Version'
    };

    let sharedPaths: any = {
      web: 'src/app/shared/sdk',
      nativescript: 'src/app/shared/sdk',
      ionic: 'src/app/shared/sdk'
    };

    let clients: { path: string, type: string }[] = <{ path: string, type: string }[]>this.config.get('clients');
    let choices: string[] = new Array<string>();

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

    this.config.set('version', require('../../package.json').version);

    return this.prompt([{
      type    : 'list',
      name    : 'list',
      message : 'What do you want to do?',
      default : 0,
      choices : choices
    }]).then(function (answers: { list: any }) {
      let done = this.async();
      let answer = answers.list;
      switch (answer) {
        case keys.GENERATE_PROJECT:
          this.composeWith('fireloop:server').on('end', () =>
            this.composeWith('fireloop:setup').on('end', () => done())
          );
          break;
        case keys.GENERATE_CLIENT:
          this.composeWith('fireloop:ng2').on('end', () => {
            done();
          });
          break;
        case keys.GENERATE_SDK:
          this.prompt([{
            type    : 'list',
            name    : 'client',
            message : 'For which application do you want to build an SDK?',
            default : 0,
            choices : Object.keys(clients)
          }]).then(function (answers: { client: any }) {
            this.composeWith('fireloop:sdk', {
              options: {
                clientPath : `${clients[answers.client].path}/${sharedPaths[clients[answers.client].type]}`,
                type       : clients[answers.client].type
              }
            });
          }.bind(this));
          break;
        case keys.FIRELOOP_VERSION:
          let version = require('../../package.json').version;
          this.log(chalk.blue(`\nFireLoop Version: ${version}\n`));
          break;
      }
    }.bind(this));
  }
});