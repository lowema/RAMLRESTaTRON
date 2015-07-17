// include all the libraries and set up global options
var Hapi = require('hapi');
var Good = require('good');
var Config = require('./config');

// detector and admin requirements
var Plugins = require('./server/plugins');
var Admin = require('./server/admin/admin-server');
var plugins = {};

// make a HAPI server
var server = new Hapi.Server();
server.connection(Config.serverOptions);

// static administration routes
Admin.addRoutes(server,Admin);

// dynamically load the routes from the files in the plugins folder
var pluginFolder = __dirname + Config.pluginFolder;
Plugins.detect(plugins, pluginFolder);
Plugins.register(server, plugins);

// start hapi
server.register(
    {
        register: require('good'),
        options: Config.goodOptions
    }, 
    function (err) {
        if (err) {
            console.error(err);
        } else {
            server.start(function () {
                server.log('info','Server started at ' + server.info.uri);
            });
        }
    }
);