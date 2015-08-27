var mongoData = require('./data/mongoData');

var reply = function(err,doc,rep) {

	if(!err) {
		if(doc) {
			rep(doc).code(200);
		} else {
			rep('ERROR: Cannot Find ' + processID).code(404);
		}
	} else {
		rep('ERROR:' + err).code(500);
	}
};

exports.processes = {
	route: '/processes',
	methods: {
		POST: function(req, rep) {
			var processDoc = req.payload; 
			var processID = processDoc.processID;
	
			mongoData.processes.save(processID, processDoc, function(err,doc) {
				reply(err,doc,rep);
			});
		}		
	}
};

exports.process = {
	route: '/processes/{processID}',
	methods: {
		PUT: function(req, rep) {
			var processDoc = req.payload; 
			var processID = parseInt(req.params.processID,10);
	
			mongoData.processes.save(processID, processDoc, function(err,doc) {
				reply(err,doc,rep);
			});
		},
		
		GET: function(req, rep) {
			var processID = parseInt(req.params.processID,10);
			
			mongoData.processes.find(processID, function(err,doc) {
				reply(err,doc,rep);
			});
		},
				
		DELETE: function(req, rep) {
			var processID = parseInt(req.params.processID,10);
			
			mongoData.processes.remove(processID, function(err,doc) {
				reply(err,doc,rep);
			});
		}
	}
};
