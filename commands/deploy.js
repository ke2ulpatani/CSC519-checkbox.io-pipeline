const chalk = require('chalk');

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


exports.handler = async argv => {
    const { jobName, inventory } = argv;

    (async () => {

        await run( jobName,inventory );

    })();

};

async function run(jobName, inventory) {

    console.log(jobName + "  " + inventory);
}
