'use strict';

var Event = require('.././models/event');

module.exports = function (app) {
    // get all events
    app.get('/api/events', function (req, res) {
        Event.find(function (err, events) {
            if (err) {
                res.send(err);
            }

            res.json(events);
        });
    });

    // get event by id
    app.get('/api/events/:id', function (req, res) {
        var id = req.params.id;

        Event.findById(id, function (err, event) {
            if (err)
                res.send(err);

            res.json(event);
        });
    });

    // create new event
    app.post('/api/events', function (req, res) {
        var eventData = req.body;

        eventData.created_on = new Date();

        Event.create(eventData, function (err, event) {
            if (err)
                res.send(err);

            res.json(event);

        });
    });

    // update event by id
    app.put('/api/events/:id', function (req, res) {
        var id = req.params.id;
        var eventData = req.body;
        var options = { new: true };

        eventData.updated_on = new Date();

        Event.findByIdAndUpdate(id, eventData, options, function (err, event) {
            if (err)
                res.send(err);

            res.json(event);
        });
    });

    // delete event by id
    app.delete('/api/events/:id', function (req, res) {
        var id = req.params.id;

        Event.remove({
            _id: id
        }, function (err) {
            if (err)
                res.send(err);
            else
                res.send('Event has been deleted successfully!');
        });
    });
};
