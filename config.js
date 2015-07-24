// HAPI Good Logging Options
exports.goodOptions = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', request:'*', response: '*' }
    }, {
        reporter: require('good-file'),
        events: { ops: '*' },
        config: './logs/ops.log' 
    }, {
        reporter: require('good-file'),
        events: { error: '*' },
        config: './logs/error.log' 
    }]
};

// HAPI Server listening port
exports.serverOptions = {
    port:3000
};

// server plugins folder
exports.pluginFolder = '/plugins';

// server raml folder
exports.ramlFolder = './raml';
exports.ramlExportFolder = './plugins';
