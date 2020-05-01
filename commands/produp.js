const child = require('child_process');
const chalk = require('chalk');
const path = require('path');
const os = require('os');

const scpSync = require('../lib/scp');
const sshSync = require('../lib/ssh');
const JENKINS_IP = "192.168.33.20";

exports.command = 'prod up';
exports.desc = 'Provision cloud instances and control plane';
exports.builder = yargs => {
    yargs.options({
    });
};


exports.handler = async argv => {
    const {} = argv;

    (async () => {

        await run();

    })();

};

async function run() {

    let filePath = '/bakerx/production/playbook.yml';
    let inventoryPath = '/bakerx/pipeline/inventory.ini';

    console.log(chalk.blueBright('Running ansible script for Production...'));
    result = sshSync(`/bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath}`, `vagrant@${JENKINS_IP}`);
    if( result.error ) { process.exit( result.status ); }

    setTimeout(function(){
      console.log(chalk.blueBright('Running ansible script for Monitoring...'));
      result = sshSync(`sudo /bakerx/pipeline/run-ansible.sh /bakerx/monitor/playbook.yml /bakerx/inventory.ini`, `vagrant@${JENKINS_IP}`);
      if( result.error ) { process.exit( result.status ); }
    }, 15000);

}
