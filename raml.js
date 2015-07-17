var Raml = require('raml-parser');
var Config = require('./config.js');
var fs = require('fs');

var ramlFile = Config.ramlFolder + '/' + process.argv[2];
var jsFile = Config.pluginFolder + '/' + process.argv[2].replace('.','_') + '.js'
console.log('Attempting to process file ' + ramlFile);
console.log('Writing to file ' + jsFile);
console.log(' ');

var outFile = fs.createWriteStream(jsFile);
var context = {};

var file = fs.createWriteStream('example.txt');
file.write('hello, ');
file.end('world!');
 
Raml.loadFile(ramlFile).then( 
	function(data) {
		console.log(data.title + ' ' + data.version);
		outFile.write('/*\n');
		outFile.write('\t' + data.title + ' ' + data.version + '\n' );
		outFile.write('\tGenerated by the amazing RAMLRESTaTRON.\n');
		outFile.write('*/\n\n');
		
		console.log('Routes: ');		
		parseResource(data.resources,'');
		
		console.log(' ');
		console.log('Complete !');
		
		outFile.end('// end of generated code.');
		console.log(context);
	}, 
	function(error) {
		console.log('Error parsing: ' + error);
		outFile.end('');
	}
);

function parseResource(resource, currentRoute) {
	
	if( typeof resource === 'undefined' ) { 
		return null; 
	} 
	
	for( var r=0; r < resource.length; r++ ) {
		var currentResource = currentRoute + resource[r].relativeUri;
		var currentExport = currentResource.replace(/\//g,'_').replace(/{/g,'').replace(/}/g,'') + '_' + r.toString();
		console.log('  ' + currentResource);
		
		outFile.write("exports." + currentExport + " = {\n");
		outFile.write("\troute: '" + currentResource + "'");
		
		//console.log(resource[r].methods);
		if( typeof resource[r].methods != 'undefined' ) {
			outFile.write(",\n\tmethods: {");
			for( var m=0; m < resource[r].methods.length; m++ ) {
				console.log('    ' + resource[r].methods[m].description + ' [' + resource[r].methods[m].method.toUpperCase() + ']');
				if(m > 0) {
					outFile.write(",\n");
				} else {
					outFile.write("\n");
				}
				outFile.write("\n\t\t" + resource[r].methods[m].method.toUpperCase() + ": function(req,rep) {\n");

				console.log('      URI Parameters:');
				var uriParams = currentResource.split('/');
				for(var u = 1; u < uriParams.length; u++) {
					if( uriParams[u].charAt(0) === '{') {
						console.log('        ' + uriParams[u].replace(/{/g,'').replace(/}/g,''));
						outFile.write("\t\t\tvar " + uriParams[u].replace(/{/g,"").replace(/}/g,"") + " = req.params." + uriParams[u].replace(/{/g,"").replace(/}/g,"") + "; \n");
					}
				}

				console.log('      Query Parameters:');
				for(var queryParameter in resource[r].methods[m].queryParameters) {
					console.log('        ' + queryParameter);
					outFile.write("\t\t\tvar " + queryParameter + " = req.query." + queryParameter + ";\n");
				}

				outFile.write("\n");
				outFile.write("\t\t\tvar replyDoc = {};\n\n");
				
				console.log('      Responses:');
				for(var response in resource[r].methods[m].responses) {
					console.log('        ' + response);
					//console.log(resource[r].methods[m].responses[response]);
					switch(response) {
					    case '200':
							outFile.write("\t\t\t//Use this code to reply with 200 and the document\n");
							outFile.write("\t\t\trep(replyDoc).code(200);\n\n");
					        break;
					    case '404':
							outFile.write("\t\t\t//Use this code to reply with 404 when the resource cannot be found\n");
					        outFile.write("\t\t\t//\trep('URI resource not found').code(404);\n");
					        break;
					    default:
							outFile.write("\t\t\t//Use this code to reply with these responses\n");
					        outFile.write("\t\t\t//\trep('Error code " + response + "').code(" + response + ");\n");
					}
				
				}
				
				outFile.write("\t\t}");
				if( m >= resource[r].methods.length - 1 ) {
					outFile.write("\n");
				}
			}
			outFile.write("\t}\n");
		}
		
		outFile.write('};\n\n\n');
		
		//recurse to the next level if there are more resources
		if(resource[r].resources != 'undefined') {
			parseResource(resource[r].resources, currentResource);
		}
	}

}