//jshint esversion:6
require('dotenv').config();
express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { check, validationResult } = require("express-validator");
const { use } = require('passport');
const jwt = require("jsonwebtoken");
//const router = require('./routes/routes.js'); 
const User = require('./models/user.js');
const Event = require('./models/event');
const {routesInit} = require('./routes/config_route')

const validate = [
    check('email')
        .isEmail()
        .withMessage('נא להכניס מייל תקין'),
    check("password")
        .isLength({ min: 6 })
        .withMessage('לפחות חמישה תוים')
]

const generateToken = user => {
    return jwt.sign(
        { _id: user._id },
        "SHHH, LITTLE S"
    );
}

const app = express();

routesInit(app);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

const verifyToken = require('./verifyToken');

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


module.exports = {
    Event, User
}

mongoose.connect(
    "mongodb://localhost:27017/app",
    async (err) => {
        if (err) throw err;
        console.log("conncted to db")
    }
)

////////////////////////////////////////////////////////////////////////////////

app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
})

//////////////

app.listen(3000, () => {
    console.log("OK");
});

