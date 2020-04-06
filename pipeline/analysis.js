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
            complexity(result[i],function(err) {
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
	this.maxMessageChainsCount = 0;
    this.ifCounts = 0;
};

async function complexity(filePath,callback)
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
                
                if (child.type == 'IfStatement') {
                    builder.ifCounts++;
                    if(builder.ifCounts >5) {
                        console.log("if count exceeded 5 : "+builder.FunctionName+" file: "+filePath);
                        process.exit(1);
                    }
                }
                
                if (child.type === 'MemberExpression') {
                    currentChainsCount = 1;
                     visitAST(child.object,function(child) {
                        if(child.type === 'MemberExpression') {
                            currentChainsCount++;
                        }
                    });

                    builder.maxMessageChainsCount = Math.max(currentChainsCount, builder.maxMessageChainsCount);
                }

            });

            if ((node.loc.start.line - node.loc.start.line) > 100) {
                console.log("long method detected : "+builder.FunctionName+" file: "+filePath);
                process.exit(1);
            }

            if(builder.maxMessageChainsCount > 10) {
                console.log("max chain exceeded 10: "+builder.FunctionName+" file: "+filePath)
                process.exit(1);
            }
            builders[builder.FunctionName] = builder;
        }
        
    });
    callback(null);

}
main();