var express = require('express')
var expresshbs = require('express-handlebars')
var path = require('path')
var bodyParser = require('body-parser')
var request = require('superagent')
var tumblr = require('tumblr.js')

var app = express()

// view engine setup
app.engine('handlebars', expresshbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.render('Index')
})

app.post('/feed', function(req, res) {
  // redditAPI()
  tumblrAPI()
  // twitterAPI()
  // someOtherAPI()
  // anotherAPI()
  res.render('Feed')
})

function redditAPI() {
  request
    .get("https://www.reddit.com/r/tech/top/.json?count=20")
    .end(function (err, res) {
      for (var i = 0; i < res.body.data.children.length; i++) {
        if (i >= 0) {
          var Redditobj = {
            thumbnail: res.body.data.children[i].data.thumbnail,
            title: res.body.data.children[i].data.title,
            score: res.body.data.children[i].data.score
          }
        }
        console.log(Redditobj)
      }
      console.log('------------')
    });
}

function tumblrAPI() {
  request
    .get('http://api.tumblr.com/v2/tagged?tag=gif')
    .set('api_key',)
    .end(function (err, res) {
      console.log(res)
    })
}










module.exports = app;
