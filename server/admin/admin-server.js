exports.addRoutes = function(server,adminRequire) {
	
	server.route({
	    method: 'GET',
	    path: '/admin',
	    handler: {
	        file: './client/index.html'
	    }
	});
	
	server.route({
	    method: 'GET',
	    path: '/admin/client/{param*}',
	    handler: {
	        directory: {
	            path: './client'
	        }
	    }
	});

	server.route({
	    method: 'GET',
	    path: '/admin/api/status',
	    handler: function(req,rep) {
	        adminRequire.status(req,rep,server);
	    }
	});
	
}

exports.status = function(req,rep,server) {
	rep('Running ' + server.version);
}
