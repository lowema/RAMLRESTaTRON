var MongoClient = require('mongodb').MongoClient;
var Config = require('./config');

// spin up a DB instance to hook onto when connecting
var processCollection = null;

// Use connect method to connect to the Server
MongoClient.connect(Config.mongoURL, function(err, db) {
	if(!err) {
		// set up the global DB connection
		processCollection = db.collection('processes');
		console.log('Connected to MongoDB');
	} else {
		// oh shit
		console.error('Cannot connect to the MongoDB')
	}

});

// export the DB collection "processes"
exports.processes = {
	
	save: function(ID, processDoc, callback) {
		var searchExpression = {
			processID: ID
		};
		var updateOptions = {
			upsert: true,
			returnOriginal: false
		};
		processCollection.findOneAndReplace(
			searchExpression,
			processDoc, 
			updateOptions, 
			function(err, doc) {
				callback(err, doc);
	    });
	},
	
	find: function(ID, callback) {
		var searchExpression = {
			processID: ID
		};
		processCollection.findOne(
			searchExpression, 
			function(err, doc) {
				callback(err,doc);
	    });
	},
	
	remove: function(ID, callback) {
		var searchExpression = {
			processID: ID
		};
		processCollection.findOneAndDelete(
			searchExpression, 
			function(err, doc) {
				callback(err, doc);
	    });
	}
	
}
