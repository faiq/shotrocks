var express = require('express')
  , bodyParser = require('body-parser') 
  , cookieParser = require('cookie-parser')  
  , mongoose = require('mongoose') 
  , session = require('express-session')
  , path = require('path')
  , http = require('http')
  , User = require('./Models/User')
  , app = express()
  , server = http.createServer(app)
  , notify = require('./notify');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(session({
  secret: 'tacocat',
  key: 'sid'
}));

mongoose.connect('mongodb://104.131.103.149/shotrocks');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.get('/', function (req, res) {
  if (req.session.email) {   
    User.findOne({email: req.session.email}, function (err, user) {
      if (err) {  res.status(401).send({ err: "no credentials"})   
        console.log(err) 
      } 
      res.sendFile(path.join(__dirname, '/views/main.html'))
    }) 
  } 
  res.sendFile(path.join(__dirname, '/views/login.html'))
}) 

app.post('/signin', function (req, res) {
  User.findOne({email: req.body.email}, function (err, user) {
      if (err) {  
        res.status(401).send({ err: "wrong credentials"})   
        console.log(err) 
      }   
      if (!user) res.status(401).send({ err: "wrong credentials"})   
      
      if (user.validPassword(req.body.password)) {   
        req.session.email = req.body.email
        req.session.noOfDrinks = 0
        res.sendfile(path.join(__dirname, '/views/main.html'))
      }
    }) 
})

app.post('/register', function(req, res) {
  var newUser = new User();
  console.log(req.body.confirmPassword);
  console.log(req.body);
  if (req.body.password !== req.body.confirmPassword) res.status(404).send({ error: 'Passwords Dont match' });
  newUser.email = req.body.email;
  newUser.password = newUser.generateHash(req.body.password);
  newUser.weight = req.body.weight;
  newUser.gender = req.body.gender;
  newUser.save(function(err) {
    if (err)
      res.status(500).send({ error: 'Something went wrong on our end'});
    else 
      res.send("signed up");
  }) 
  req.session.email = req.body.email;
  req.session.noOfDrinks = 0;
})

app.post('/drink', function (req, res) { 
  if (!req.session.email) { 
    res.status(401).send({ err: "no credentials"})   
    console.log('no session')
  } 
  var date = new Date().getTime()
  User.findOne({email : req.session.email}, function (err, user) { 
    if (err) { 
      res.status(401).send({ err: "no credentials"}) 
    }
    if (!user) {  res.status(401).send({ err: "no credentials"})  }
    if (user.nights.length == 0) {
      var night = new Date()
      console.log('taco') 
      user.nights.push({date:night, drinks:[{name: req.body.drinkId, timestamp: date}]}) 
    } else { 
      if ((user.nights[user.nights.length - 1]).date.getTime() - date < 18000000) {
        user.nights[user.nights.length - 1].drinks.push({name: req.body.drinkId, timestamp: date})
        req.session.noOfDrinks++ 
        if (req.session.noOfDrinks === 7) {
            // send push notification
            setTimeout(function() {
                notify('You should start drinking water!');
            }, 6000);
            req.session.noOfDrinks = 0 
        } 
      } 
      else {
        var night = new Date()
        user.nights.push({date:night, drinks:[{name: req.body.drinkId, timestamp: date}]}) 
      } 
    }
    user.save(function(err) {
      if (err)
        res.status(500).send({ error: 'Something went wrong on our end'})
      else 
        res.send('drink recorded') 
    }) 
  })      
}) 

app.get('/register', function (req, res) {
   res.sendFile(path.join(__dirname, '/views/registration.html'))
});

app.get('/settings', function (req, res) {
   res.sendFile(path.join(__dirname, '/views/main.html'))
}) 

server.listen(5000)
