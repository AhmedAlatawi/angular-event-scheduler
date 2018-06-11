//  OpenShift sample Node application
var express = require('express'),
    app     = express(),
    mongoose = require('mongoose'),
    morgan  = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    local = require('./config/env/local'),
    openshift3 = require('./config/env/openshift3'),
    port,
    ip,
    env;
    
Object.assign=require('object-assign');

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'));

port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// TODO: will need fixed when more envs are added
env = process.env.NODE_ENV === 'local' ? local : openshift3;

mongoose.connect(env.url);

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
