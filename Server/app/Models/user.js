var mongoose = require('mongoose')
  , crypto = require('crypto')
  , Schema = mongoose.Schema

var userSchema = new Schema({
  email: String,
  password: String,
  nights: [night] 
}

var night = new Schema({
  date: Date,
  drinks: [drink]
}) 

var drink = new Schema({
  name: String,
  alcoholContent: Number,
  timestamp: Number
})

module.exports = mongoose.model('User', userSchema)
