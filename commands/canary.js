const child = require('child_process');
const chalk = require('chalk');
const path = require('path');
const os = require('os');
const fs = require('fs');

const scpSync = require('../lib/scp');
const sshSync = require('../lib/ssh');

const PROXY_IP = "192.168.44.20";
const BLUE_IP = "192.168.44.25";
const GREEN_IP = "192.168.44.30";
const PROXY_PORT = "3080";
const SERVICE_PORT = "3000";
const BLUE_NAME = "blue-srv-m3";
const GREEN_NAME = "green-srv-m3";

exports.command = 'canary <blueBranch> <greenBranch>';
exports.desc = 'Canary analysis between two branches';
exports.builder = yargs => {
    yargs.options({
    });
};

exports.handler = async argv => {
    const { blueBranch, greenBranch } = argv;

    (async () => {

        await run( blueBranch, greenBranch );

    })();

};

function startServers() {
    return new Promise(async function(resolve, reject) {
        console.log(chalk.whiteBright('Setting Up Servers For Canary Analysis!'));
        
        console.log(chalk.whiteBright('Provisioning proxy server...'));
        let result = child.spawnSync(`bakerx`, `run proxy-srv-m3 bionic --ip ${PROXY_IP} --sync --memory 2048`.split(' '), {shell:true, stdio: 'inherit'} );
        if( result.error ) { console.log(result.error); process.exit( result.status ); }
        
        console.log(chalk.blueBright('Provisioning blue server...'));
        result = child.spawnSync(`bakerx`, `run ${BLUE_NAME} bionic --ip ${BLUE_IP} --sync --memory 2048`.split(' '), {shell:true, stdio: 'inherit'} );
        if( result.error ) { console.log(result.error); process.exit( result.status ); }
        
        console.log(chalk.greenBright('Provisioning green server...'));
        result = child.spawnSync(`bakerx`, `run ${GREEN_NAME} bionic --ip ${GREEN_IP} --sync --memory 2048`.split(' '), {shell:true, stdio: 'inherit'} );
        if( result.error ) { console.log(result.error); process.exit( result.status ); }
        
        resolve(42);
    });
}

function run_init_script(SERVER_IP, service_branch=null, service_name=null) {
    /* installs ansible and sets key permission */
    return new Promise(async function(resolve, reject) {
        console.log(chalk.whiteBright(`Running init script on ${service_name}...`));
        let init_script_cmd = `/bakerx/canary/server-init.sh ${PROXY_IP} ${PROXY_PORT} ${BLUE_IP} ${GREEN_IP} ${BLUE_NAME} ${GREEN_NAME} ${SERVICE_PORT}`;
        if(service_branch && service_name)
            init_script_cmd = `/bakerx/canary/server-init.sh ${PROXY_IP} ${PROXY_PORT} ${BLUE_IP} ${GREEN_IP} ${BLUE_NAME} ${GREEN_NAME} ${SERVICE_PORT} ${service_branch} ${service_name}`;

        console.log(chalk.whiteBright('Installing privateKey on the server'));
        let identifyFile = path.join(os.homedir(), '.bakerx', 'insecure_private_key');
        result = scpSync (identifyFile, `vagrant@${SERVER_IP}:/home/vagrant/.ssh/mm_rsa`);
        if( result.error ) { console.log(result.error); process.exit( result.status ); }
        
        result = sshSync(init_script_cmd, `vagrant@${SERVER_IP}`, 'ignore');
        if( result.error ) { console.log(result.error); process.exit( result.status ); }
        
        resolve(42);
    });
}


function setupBlue(blueBranch) {
    return new Promise(async function(resolve, reject) {
        await run_init_script(BLUE_IP, blueBranch, BLUE_NAME);
        let filePath = '/bakerx/canary/playbook-blue.yml';
        let inventoryPath = '/bakerx/canary/inventory.ini';

        console.log(chalk.blueBright('Running ansible script on BLUE...'));
        result = sshSync(`/bakerx/canary/run-ansible.sh ${filePath} ${inventoryPath}`, `vagrant@${BLUE_IP}`);
        if( result.error ) { process.exit( result.status ); }
        
        resolve(42);
    });
}

function setupGreen(greenBranch) { 
    return new Promise(async function(resolve, reject) {
        await run_init_script(GREEN_IP, greenBranch, GREEN_NAME);
        let filePath = '/bakerx/canary/playbook-green.yml';
        let inventoryPath = '/bakerx/canary/inventory.ini';

        console.log(chalk.greenBright('Running ansible script on GREEN...'));
        result = sshSync(`/bakerx/canary/run-ansible.sh ${filePath} ${inventoryPath}`, `vagrant@${GREEN_IP}`);
        if( result.error ) { process.exit( result.status ); }
        
        resolve(42);
    });
}

function setupProxy() {
    return new Promise(async function(resolve, reject) {
        await run_init_script(PROXY_IP, null, "proxy-srv-m3");
        let filePath = '/bakerx/canary/playbook-proxy.yml';
        let inventoryPath = '/bakerx/canary/inventory.ini';

        console.log(chalk.whiteBright('Running ansible script on PROXY...'));
        result = sshSync(`/bakerx/canary/run-ansible.sh ${filePath} ${inventoryPath}`, `vagrant@${PROXY_IP}`);
        if( result.error ) { process.exit( result.status ); }
        
        resolve(42);
    });
}

function checkReportFile() {
    var reportFile = path.join(__dirname,'..','canary_report.txt');
    // delete old canary report if already present 
    fs.unlink(reportFile, (err) => {
        if (err);
        // else
        //     console.log('file was deleted');
    });
    
    var maxTries = 20; 
    var tmins = 1; // change to 5
    setTimeout(() => {    // wait for 2t mins
        // check for report file generation on every 10 second
        const checkReport = setInterval(function() {
            const file = reportFile;
            const fileExists = fs.existsSync(file);
            maxTries--;
            // console.log('Report Generated?: ', fileExists, maxTries);
            process.stdout.write(".");
            if (fileExists) {
                console.log('\nReport Generated!');
                console.log(fs.readFileSync(reportFile).toString());
                clearInterval(checkReport);
            }
            if(maxTries==0)
            {
                console.log('\nReport Generation Failed!');
                clearInterval(checkReport);
            }
        }, 10000);
    }, 2*tmins*60*1000);
}
  
async function run(blueBranch, greenBranch) {
    checkReportFile();
    await startServers(); // create VMs
    await setupBlue(blueBranch);
    await setupGreen(greenBranch);
    await setupProxy();
    process.stdout.write("Waiting for report");
}
