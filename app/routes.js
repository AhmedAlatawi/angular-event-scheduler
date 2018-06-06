'use strict';

var Event = require('./models/event');

module.exports = function (app) {
    app.get('/api/nerds', function (req, res) {
        Event.find(function (err, events) {
            if (err)
                res.send(err);

            res.json(events);
        });
    });

    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });
};
