//  OpenShift sample Node application
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    local = require('./config/env/local'),
    openshift3 = require('./config/env/openshift3'),
    initDb,
    port,
    ip,
    env;

Object.assign = require('object-assign');

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));

port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// TODO: will need fixed when more envs are added
env = process.env.NODE_ENV === 'local' ? local : openshift3;

var mongoURLLabel = "";

if (env.url == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD'],
        mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = env.url = 'mongodb://';
        if (mongoUser && mongoPassword) {
            env.url += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        env.url += mongoHost + ':' + mongoPort + '/' + mongoDatabase;

    }
}

initDb = function (callback) {
    if (env.url == null) return;

    //mongoose.connect(env.url);
    mongoose.connect(env.url, function (err, conn) {
        if (err) {
            callback(err);
            return;
        }
        console.log('Connected to MongoDB at: %s', env.url);
    });
};

// error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
});

initDb(function (err) {
    console.log('Error connecting to Mongo. Message:\n' + err);
});

app.use(bodyParser.json());

app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

require('./app/routes/event')(app);
require('./app/common-routes')(app);

app.listen(port);

console.log('Server running on port: ' + port);

// expose app           
exports = module.exports = app;
