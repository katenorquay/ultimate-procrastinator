var express = require('express')
var expresshbs = require('express-handlebars')
var path = require('path')
var bodyParser = require('body-parser')
var dotenv = require('dotenv')
dotenv.load()

require('dotenv').config()

var app = express()

// view engine setup
app.engine('handlebars', expresshbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
