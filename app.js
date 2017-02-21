var express = require('express')
var expresshbs = require('express-handlebars')
var path = require('path')
var bodyParser = require('body-parser')

var app = express()

// view engine setup
app.engine('handlebars', expresshbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

var search = []

app.get('/', function(req, res) {
  res.render('Index')
})

app.post('/feed', function(req, res) {
  search.push(req.body.name)
})









module.exports = app;
