var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt-nodejs')
  

var userSchema = new Schema({
  email: String,
  password: String,
  height: Number, 
  weight: Number,
  age: Number,
  nights: [night] 
}

var night = new Schema({
  date: Date,
  drinks: [drink]
}) 

var drink = new Schema({
  name: String
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password)
}

module.exports = mongoose.model('User', userSchema)
