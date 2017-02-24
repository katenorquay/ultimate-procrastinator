var dotenv = require('dotenv')
dotenv.load()
var express = require('express')
var expresshbs = require('express-handlebars')
var path = require('path')
var bodyParser = require('body-parser')
var request = require('superagent')
var tumblr = require('tumblr.js')
var Twitter = require('twitter')
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
  twitterAPI(function (tweets) {
    redditAPI(function (redditStories) {
      hackerNewsAPI(function (hackerStories) {
        var data = {
          tweets: tweets,
          redditStories: redditStories,
          hackerStories: hackerStories
        }
        res.send(data)
      })
    })
  })
});


function redditAPI(callback) {
  var Redditobjs = []
  request
    .get("https://www.reddit.com/r/tech/top/.json?count=10")
    .end(function (err, res) {
      if (err) {console.log(err)}
      for (var i = 1; i < 5; i++) {
          Redditobj = {
            thumbnail: res.body.data.children[i].data.thumbnail,
            title: res.body.data.children[i].data.title,
            score: res.body.data.children[i].data.score
        }
        Redditobjs.push(Redditobj)
      }
      callback(Redditobjs)
    });
}


function hackerNewsAPI(callback) {
  request
    .get("https://community-hacker-news-v1.p.mashape.com/topstories.json?print=pretty")
    .set("X-Mashape-Key", process.env.HACKER_NEWS_API_KEY)
    .set("Accept", "application/json")
    .end(function (err, res) {
      if (err) { console.log(err)}
      else {
        var topStories = res.body.slice(0, 5)
        getHackerStories(topStories, callback)
      }
    });
}

function getHackerStories(topStories, callback) {
  var hackerObjs = []
  topStories.map(function (story) {
    request
      .get("https://community-hacker-news-v1.p.mashape.com/item/" + story + ".json?print=pretty")
      .set("X-Mashape-Key", process.env.HACKER_NEWS_API_KEY)
      .set("Accept", "application/json")
      .end(function (err, res) {
        if (err) { console.log(err) }
        else {
          hackerObj = {
            title: res.body.title,
            url: res.body.url,
            score: res.body.score
          }
          hackerObjs.push(hackerObj)
          if (hackerObjs.length === 5) {
            callback(hackerObjs)
          }
      }
  })
})
}

var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

function twitterAPI(callback) {
  var theTweets;
  twitterClient.get('search/tweets', {q: '#tech', lang: 'en' }, function(error, tweets, response) {
    if (error) { console.log(error) }
    else {
      theTweets = extractTweetText(tweets, callback)
    }
  });
}

function extractTweetText(tweets, callback) {
  var tweetText = []
  for (var i = 0; i < tweets.statuses.length; i++) {
    tweetText.push(tweets.statuses[i].text)
  }
  callback(tweetText)
}













module.exports = app;
