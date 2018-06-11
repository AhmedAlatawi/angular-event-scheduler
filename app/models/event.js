
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    created_on: Date,
    updated_on: Date
});

module.exports =  mongoose.model('Event', eventSchema);