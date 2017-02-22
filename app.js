var dotenv = require('dotenv')
dotenv.load()
var express = require('express')
var expresshbs = require('express-handlebars')
var path = require('path')
var bodyParser = require('body-parser')
var request = require('superagent')
var tumblr = require('tumblr.js')

require('dotenv').config()


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
  // mediumAPI()
  hackerNewsAPI()
  // twitterAPI()
  // anotherAPI()
  res.render('Feed')
})

function redditAPI() {
  request
    .get("https://www.reddit.com/r/tech/top/.json?count=20")
    .end(function (err, res) {
      if (err) {console.log(err)}
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


function hackerNewsAPI() {
  request
    .get("https://community-hacker-news-v1.p.mashape.com/topstories.json?print=pretty")
    .set("X-Mashape-Key", process.env.HACKER_NEWS_API_KEY)
    .set("Accept", "application/json")
    .end(function (err, res) {
      if (err) { console.log(err)}
      else {
        var topStories = res.body.slice(0, 5)
        getStories(topStories)
      }
    });
}

function getStories(topStories) {
  console.log(topStories)
}












module.exports = app;
