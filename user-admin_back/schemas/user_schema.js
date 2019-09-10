
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    userid: Number,
    name: String,
    pass: String,
    email: String
});    


module.exports = mongoose.model('users', userSchema);     