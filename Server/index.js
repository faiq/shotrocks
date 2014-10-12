var express = require('express')
  , bodyParser = require('body-parser') 
  , cookieParser = require('cookie-parser')  
  , mongoose = require('mongoose') 
  , session = require('express-session')
  , path = require('path')
  , http = require('http')
  , User = require('./App/Models/User')
  , app = express()
  , server = http.createServer(app) 

app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser())
app.use(bodyParser.json())  
app.use(bodyParser.urlencoded())
app.use(session({
  secret: 'tacocat',
  key: 'sid'
}))

mongoose.connect('mongodb://localhost/shotrocks')
var db = mongoose.connection
  , db.on('error', console.error.bind(console, 'connection error:'))

app.get('/', function (req, res) {
  if (req.session.email) {   
    User.findOne({email: req.session.email}, function (err, user) {
      if (err) 
        res.status(401).send({ err: "no credentials"})   
      res.render('index ' , {user: user.email }) 
    }) 
  } 
  res.render('index ' , {user: user.email }) 
}) 

app.post('/register', function(req, res) {
  var newUser = new User();
  if (req.body.password !== req.body.passwordConfirm) res.status(404).send({ error: 'Passwords Dont match' })
  newUser.local.email = req.body.email
  newUser.local.password = newUser.generateHash(password)
  newUser.local.height = req.body.height
  newUser.local.weight = req.body.weight 
  newUser.local.age = req.body.age
  newUser.save(function(err) {
    if (err)
      res.status(500).send({ error: 'Something went wrong on our end'})
  }) 
  req.session.email = req.body.email
})

app.post('/drink', function (req, res) { 
  if (!req.session.email) 
    res.status(401).send({ err: "no credentials"})   
  var date = new Date().getTime()
  User.findOne({email : req.session.email}, function (err, user) { 
    if (err) res.status(401).send({ err: "no credentials"})   
    if (!user.nights) {
      var night = new Date()
      user.nights.push({date:night, drinks:[{name: req.body.drinkId, timestamp: date}]}) 
    } else { 
      if (user.nights.getTime() - date < 18000000) 
        //push to the latest night 
        user.nights[user.nights.length].drinks.push({name: req.body.drinkId, timestamp: date})
      else {
        var night = new Date()
        user.nights.push({date:night, drinks:[{name: req.body.drinkId, timestamp: date}]}) 
      } 
    } 
  })      
}) 

app.get('/register', function (req, res) {
   res.render('register', { })  
}) 

server.listen(5000)
