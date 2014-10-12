var express = require('express')
  , bodyParser = require('body-parser') 
  , cookieParser = require('cookie-parser')  
  , passport = require('passport')
  , mongoose = require('mongoose') 
  , session = require('express-session')
  , path = require('path')
  , http = require('http')
  , app = express()
  , server = http.createServer(app); 

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser())
app.use(cookieParser())
app.use(session({
  secret: 'tacocat',
  key: 'sid'
}))

app.get('/', function (req, res) {
  console.log('yo') 
  res.send('hello') 
})  

server.listen(5000);
