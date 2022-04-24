const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    isAdmin: Boolean,
    username: String,
    email: String,
    password: String,
    birthDay: Date,
    name: String,
    phone: String,
    queues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }]
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;
