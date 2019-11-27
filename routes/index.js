if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}


var express = require('express');
var bcrypt = require('bcrypt');
var passport = require('passport');
// var flash = require('express-flash');
// var session = require('express-session');

var router = express.Router();


var initializePassport = require('../passport-config');
// var app = express();


// app.use(flash());
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }))
// app.use(passport.initialize());
// app.use(passport.session());


var users = [
  { id: '1574831035806',
    name: 'w ',
    email: 'w@w',
    password: '$2b$10$F7m.M6cK1ntzeqVJAZsUs.7jn.3keQWxDWjha60TLo8DQ1i61RUz.' }
];


initializePassport(
  passport, 
  email => {return users.find(user => user.email === email)},
  id => {return users.find(user => user.id === id)}
);


/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.user;
  
  if(user)
    res.send("Hello " + user.name);

  res.render('index', { title: 'Home' });
});

router.route("/login")
  .get((req, res) => {
    res.render("login", {title: "Log in"});
    
  })
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
router.route("/sign-up")
  .get((req, res) => {
    res.render("sign-up", {title: "Sign up"});
  })
  .post( async (req, res) => {
    console.log(req.body.password)
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      console.log(hashedPassword)

      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      });

      console.log(users)
      res.redirect("/login");
    } catch(e) {
      console.error.bind("Error: " +  e);
      res.redirect('/sign-up');
    }
  });

module.exports = router;
