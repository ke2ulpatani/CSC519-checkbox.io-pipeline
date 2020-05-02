var esprima = require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var fs = require("fs");
var path = require('path');
const getFiles = function(root, ret) {
    files = fs.readdirSync(root)
    ret = ret || []
    files.forEach(function(file) {
        if(file === 'node_modules') {
            return;
        }
      if (fs.statSync(root + "/" + file).isDirectory()) {
        ret = getFiles(root + "/" + file, ret)
      } else {
        ret.push(path.join(root, "/", file))
      }
    })
   
    return ret
  } 
var builders = {};

function main()
{
	var args = process.argv.slice(2);

	if( args.length == 0 )
	{
        console.log("No directory provided");
        return;
    }
    args = args[0];
    const result = getFiles(args) 
    for(var i in result) {
        if(result[i].split('.').pop() === "js") {
            analyzeFile(result[i],function(err) {
                // console.log("gone insise "+ result[i]);
                if(err != null) {
                    console.log("something wrong with "+ result[i]);
                }
            });
        }
    }
}



function visitAST(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					visitAST(child, visitor);
            }
        }
    }
}


function getFuncName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "anon function @" + node.loc.start.line;
}

function FunctionBuilder()
{
	this.FunctionName = "";
	this.messageChainsCount = [];
    this.ifCounts = 0;
    this.longMethods = [];
};

async function analyzeFile(filePath,callback)
{
    var buf = fs.readFileSync(filePath, "utf8");
	var ast = esprima.parse(buf, options);
    var currentChainsCount = 0;
	 visitAST(ast, function (node) 
	{ 
        if (node.type === 'FunctionDeclaration') 
		{
			var builder = new FunctionBuilder();
            builder.FunctionName = getFuncName(node);
			builder.StartLine    = node.loc.start.line;
            builder.ParameterCount = node.params.length;

             visitAST(node, function (child) {
                
                if (child.type === 'IfStatement') {
                    builder.ifCounts++;
                    // if(builder.ifCounts >5) {
                    //     console.log("if count exceeded 5 : "+builder.FunctionName+" file: "+filePath);
                    //     process.exit(1);
                    // }
                }
                
                if (child.type === 'MemberExpression') {
                    currentChainsCount = 0;
                     visitAST(child.object,function(child) {
                        if(child.type === 'MemberExpression') {
                            currentChainsCount++;
                        }
                    });
                    if (builder.messageChainsCount < currentChainsCount) {
                        builder.messageChainsCount = currentChainsCount;
                    }
                }

            });

            if ((node.loc.end.line - node.loc.start.line)+1 > 100) {
                builder.longMethods.push(builder.FunctionName+" file: "+filePath);
            }

            if(builder.messageChainsCount > 10) {
                builder.messageChainsCount.push(builder.FunctionName+" file: "+filePath);
            }
            console.log("If counts: "+ builder.ifCounts);
            console.log("Max chain: "+ builder.messageChainsCount);
            console.log("Long method detected: "+ builder.longMethods);
            builders[builder.FunctionName] = builder;
            if(builder.ifCounts > 5 || builder.messageChainsCount.length > 0 || builder.longMethods > 0) {
                process.exit(1);
            }
            
        }

        
        
    });
    callback(null);

}
main();