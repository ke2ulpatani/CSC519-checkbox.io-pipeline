const fs = require('fs');
const path = require('path');
const xml2js = require("xml2js");
const child  = require("child_process");
const bluebird = require("bluebird");
const Random = require('random-js');
const _random = new Random.Random(Random.MersenneTwister19937.seed(0));
const glob = require('glob');
var parser = new xml2js.Parser();
var hashMap = {};


function fuzz(dir) {
  var args = process.argv.slice(2);
  var dirPath = dir || args[0];
  var files;
  if (!dirPath)
    throw new Error("Not Valid Directory!");

   glob(dir + '/**/*.java', function( err, globFiles ) {
    files = globFiles;
    var index = 0;
    while(index < files.length) {
        if (_random.bool(0.1))
          fuzzer(files[index]);
        index++;
    }

  });
}


function fuzzer(file) {
  var fileData = fs.readFileSync(file, 'utf-8');
  var lines = fileData.split("\n");
  fs.writeFileSync(file,'','utf8');
  lines.forEach(function(line) {
    if (_random.bool(0.1)) {
      let words = line.split(' ');
      var bool = false;
      for(var i = 0; i< words.length; i++)
      {
        if(words[i] == "==") {
          words[i] == "!=";
        }
        else if(words[i] == "!=") {
          words[i] == "==";
        }
        else if(words[i] == ">") {
          words[i] == "<";
        }
        else if(words[i] == "<") {
          words[i] == ">";
        }
        else if(words[i].equals == "true") {
          words[i] == "false";
        }
        else if(words[i].equals == "false") {
          words[i] == "true";
        }
        else if(words[i].startsWith('"') && words[i].endsWith('"')) {
          words[i] = words[i].split("").reverse().join("");
        }
        else if(words[i].startsWith("'") && words[i].endsWith("'")) {
          words[i] = words[i].split("").reverse().join("");
        }
      }

      line = words.join(" ");

      if (line.match(/[0]/)){
          line = line.replace(/[0]/g, "1");
      }
      else if (line.match(/[1]/)){
          line = line.replace(/[1]/,"0");
      }
    }

    if(line != '\r') {
        line += '\n';
    }

    fs.appendFileSync(file, line);

  });

}

function readJSON(result)
{
    var tests = [];
    var index = 0;
    while (index < result.testsuite["$"].tests)
    {
        var testcase = result.testsuite.testcase[index];
        tests.push({
        name:   testcase["$"].classname+testcase["$"].name,
        status: testcase.hasOwnProperty("failure") ? "failed": "passed"
        });
        index++;
    }
    return tests;
}

async function main() {
  var iters = parseInt(fs.readFileSync(__dirname + "/count", 'utf-8').split("\n"));
  child.execSync(`cd /var/lib/jenkins/workspace/iTrust && git reset --hard HEAD`);
  await child.execSync(`cd /var/lib/jenkins/workspace/iTrust/iTrust2 && sudo mvn -f pom-data.xml process-test-classes && mysql -u root -e 'DROP DATABASE IF EXISTS iTrust2'`);
  for(var i = 1; i <= iters;i++) {
    var currTri = 1;
    var maxTri = 25;
    while(1) {
      var flag = false;
      console.log(`Compiling Build ${i}/${iters} For ${currTri}/${maxTri} Time`);
      try {
        fuzz('/var/lib/jenkins/workspace/iTrust/iTrust2/src/main/java/edu/ncsu/csc/itrust2');
        child.execSync('cd /var/lib/jenkins/workspace/iTrust/iTrust2 && sudo mvn clean test verify');
      }
      catch(err) {
        var _err = new Buffer(err.stdout).toString("ascii");
        if (_err.includes("Compilation") == true) {
            console.log("Compilation Failed");
            //console.log(err);
            flag = true;
            currTri++;
        }
      }

      console.log(`Build Complete`);
      child.execSync(`cd /var/lib/jenkins/workspace/iTrust && git reset --hard HEAD`);
      if (flag == false || currTri > maxTri){
          break;
      }

    }

    var files = glob.sync('/var/lib/jenkins/workspace/iTrust/iTrust2/target/surefire-reports/*.xml');

    var index = 0;
    while(index < files.length) {
      var data = fs.readFileSync(files[index]);
      var datajson = await bluebird.fromCallback(cb => parser.parseString(data, cb));
      var testresult = readJSON(datajson);
      for(test in testresult) {
        //console.log(testresult[test]);
        if (!hashMap.hasOwnProperty(testresult[test].name)) {
            hashMap[testresult[test].name]={pass:0 ,fail:0}
        }

        if (testresult[test].status == "passed") {
            hashMap[testresult[test].name].pass++;
        }
        else if (testresult[test].status == "failed") {
            hashMap[testresult[test].name].fail++
        }

        //console.log(hashMap[testresult[test].name]);
      }
      index++;
    }
    child.execSync(`cd /var/lib/jenkins/workspace/iTrust/iTrust2/target/surefire-reports && sudo rm -rf *.xml && mysql -u root -e 'DROP DATABASE IF EXISTS iTrust2'`);
  }

  finalResult = [];

  for (key in hashMap) {
      //console.log(key);
      finalResult.push({
          name:   key,
          pass:   hashMap[key].pass,
          fail:   hashMap[key].fail,
          total: hashMap[key].pass + hashMap[key].fail
          })
  }

  finalResult.sort((a, b)=>{
      if (a.fail > b.fail)
        return -1;
      else if (a.fail == b.fail && a.pass < b.pass)
        return -1;
      else
        return 1;
  })

  var str = '';

  for (i in finalResult){
      str += `${finalResult[i].fail}/${iters} ${finalResult[i].name}` + '\n';
  }

  console.log(str);
  fs.writeFile('/home/vagrant/finalResult.txt', str, (err) => { if (err) throw err; });

  return;
}

main();
