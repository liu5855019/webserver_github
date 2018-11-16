// user.js - user route module.

var express = require('express');
var router = express.Router();

// Home page route.
router.get('/', function (req, res) {
  console.log("访问了/other/");
  res.send('other home page');
})

// About page route.
router.get('/about', function (req, res) {
  console.log("访问了/other/about");
  res.send('About this other');
})

module.exports = router;
