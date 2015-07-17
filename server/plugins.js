var fs = require('fs');

exports.detect = function(plugins, pluginFolder) {
	console.log('Loading files from ' + pluginFolder + '...');
	
	fs.readdirSync(pluginFolder).forEach(function(filename) {
	    if(filename.split('.')[1] === 'js') {
	        console.log('--> ' + filename);
	        plugins[filename.split('.')[0]] = require(pluginFolder + '/' + filename);
	    } else {
	        console.log('--> ' + filename + ' ***IGNORED***');
	    }    
	}, this);
}

exports.register = function(server, plugins) {
	console.log('Analysing loaded files ...');
	
	for(var plugin in plugins) {
	    for(var codeExport in plugins[plugin]) {
	        for(var method in plugins[plugin][codeExport].methods) {
	            console.log('--> ' + plugin + '.js: ' + method + ' on ' + plugins[plugin][codeExport].route);
	            var handlerRef = eval("plugins['" + plugin + "']." + codeExport + '.methods.' + method); 
	            server.route({
	                method: method,
	                path: plugins[plugin][codeExport].route,
	                handler: handlerRef 
	            });            
	        }
	    }
	}
	
}