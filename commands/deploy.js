const child = require('child_process');
const chalk = require('chalk');
const path = require('path');
const os = require('os');

const scpSync = require('../lib/scp');
const sshSync = require('../lib/ssh');
const JENKINS_IP = "192.168.33.20";
const JENKINS_PORT = "9000";


const jenkins = require('jenkins')({ baseUrl: `http://admin:12345@${JENKINS_IP}:${JENKINS_PORT}`, crumbIssuer: true, promisify: true });

exports.command = 'deploy <jobName>';
exports.desc = 'Deploy a build job with given jobName, wait for output, and print build log.';
exports.builder = yargs => {
    yargs.options({
        inventory: {
            description: 'to add invientory use `-i`',
            alias: 'i',
            type: 'string',
        }
    });
};


async function triggerBuild(job)
{
    let queueId = await jenkins.job.build(job);
    let buildId = await waitOnQueue(queueId);
    return buildId;
}

async function getBuildStatus(job, id) {
    return new Promise(async function(resolve, reject)
    {
        // console.log(`Fetching ${job}: ${id}`);

        //wait till build is complete. use while loop or wait till log is generated
        let buildData={building: true};
        while(buildData.building)
            buildData = await jenkins.build.get(job, id);

        // await jenkins.build.log({name: job, number: id});
        buildData = await jenkins.build.get(job, id);

        resolve(buildData);
    });
}

async function waitOnQueue(id) {
    return new Promise(function(resolve, reject)
    {
        jenkins.queue.item(id, function(err, item) {
            if (err) throw err;
            // console.log('queue', item);
            if (item.executable) {
                // console.log('number:', item.executable.number);
                resolve(item.executable.number);
            } else if (item.cancelled) {
                console.log('cancelled');
                reject('canceled');
            } else {
                setTimeout(async function() {
                    resolve(await waitOnQueue(id));
                }, 5000);
            }
        });
    });
  }



exports.handler = async argv => {
    const { jobName, inventory } = argv;

    (async () => {

        await run( jobName,inventory );

    })();

};

async function run(jobName, inventory) {

    if( jobName === 'checkbox.io' ) {
        let filePath = '/bakerx/deployment/checkboxio/playbook.yml';
        let inventoryPath = '/bakerx/'+inventory;

        console.log(chalk.blueBright('Running ansible script...'));
        result = sshSync(`sudo /bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath}`, `vagrant@${JENKINS_IP}`);
        if( result.error ) { process.exit( result.status ); }
    } else if (jobName === 'iTrust') {

        var jenkinsJobName = "iTrust";


        console.log(chalk.greenBright('Triggering build.'));

        let buildId = await triggerBuild(jenkinsJobName).catch( e => console.log(e));

        if (typeof buildId == 'undefined') {
            console.log(chalk.redBright(`Build ${jenkinsJobName} not found.`));
            return;
        }

        console.log(chalk.blueBright(`Received ${buildId}`));
        let build = await getBuildStatus(jenkinsJobName, buildId);

        if (build.result==='SUCCESS') {
            console.log(chalk.blueBright(`Build result: ${build.result}`));
            console.log(chalk.blueBright(`Build output:`));
        }
        else {
            console.log(chalk.redBright(`Build result: ${build.result}`));
            console.log(chalk.redBright(`Build output:`));
            process.exit(1);
        }

        let output = await jenkins.build.log({name: jenkinsJobName, number: buildId});
        // console.log( output );

        let filePath = '/bakerx/deployment/iTrust/playbook.yml';
        let inventoryPath = '/bakerx/'+inventory;

        console.log(chalk.blueBright('Running ansible script...'));
        result = sshSync(`sudo /bakerx/pipeline/run-ansible.sh ${filePath} ${inventoryPath}`, `vagrant@${JENKINS_IP}`);
        if( result.error ) { process.exit( result.status ); }
    }
    
}
