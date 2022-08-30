var express = require('express');
const { response } = require('../app');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
const userHelpers = require('../helpers/user-helpers')

/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  res.render('user/index', { user });
});

router.get('/login', function (req, res) {
  if (req.session.user) {
    res.redirect('/')
  } else

    res.render('user/login', { 'loginErr': req.session.userLoginErr })
  req.session.userLoginErr = false
});


router.get('/signup', function (req, res, next) {
  res.render('user/signup');
});


router.post('/signup', function (req, res) {
  userHelpers.doSignUp(req.body).then((names) => {
    
    res.redirect('/');
  })

});

router.post('/login', usernameToLowerCase, function (req, res, next) {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user
      req.session.user.loggedIn = true
      res.redirect('/');

    } else {
      req.session.userLoginErr = true
      res.redirect('/login')
    }
  })
});

function usernameToLowerCase(req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  next();
}

router.get('/user-form', function (req, res) {
  let user= req.session.user
  res.render('user/user-form',{user});
});

router.post('/user-form', function (req, res) {
  userHelpers.addData(req.body, (id) => {
    console.log(req.body);
    res.redirect('/user-form');
  });
});



router.get('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/');
});

module.exports = router;
