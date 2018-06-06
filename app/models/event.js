
var mongoose = require('mongoose');

// Event model
module.exports = mongoose.model('Event', {
    name : { type : String, default: '' }
});