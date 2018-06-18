
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    textColor: String,
    color: String,
    url: String,
    stick: Boolean,
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    created_on: Date,
    updated_on: Date
});

module.exports =  mongoose.model('Event', eventSchema);