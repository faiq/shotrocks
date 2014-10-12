var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , bcrypt = require('bcrypt-nodejs')
  

var userSchema = new Schema({
  email: { type: String, index:{unique: true}},
  password: String,
  height: Number, 
  weight: Number,
  age: Number,
  nights: [Night] 
});

userSchema.index({email: 1}, { unique: true });

var Night = new Schema({
  date: Date,
  drinks: [Drinks]
}) 

var Drinks = new Schema({
  name: String,
  timestamp: Number
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema)
