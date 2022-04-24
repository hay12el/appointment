const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {authToken} = require("../auth/authToken");

const router = express.Router();

router.use(bodyParser.json());
router.use(express.json());
 
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
})

//////////////

router.post("/userInfo", authToken, async (req, res) => {
    if(!req.user){
        return res.status(401).send("problem");
    }
    else{
        let user = await User.findOne({_id: req.user._id}, {password: 0});
        return res.status(200).json({user: user});
    }
});

//////////////

router.post("/login", async (req, res) => {
    let user = await User.findOne({email: req.body.email});
    if(!user){
        return res.status(401).json({msg: "לא נמצא משתמשת נסי שוב.."});
    }else{
        let pass = await bcrypt.compare(req.body.password, user.password);
        if(!pass){
            return res.status(401).json({msg: "לא נמצא משתמשת נסי שוב.."});
        }else{
            jwt.sign({_id: user._id}, "SHHHZESOD95", {expiresIn:"30 days"},(err, token) => {
                if (err){
                    console.log(err);
                }else{
                    res.status(200).send({'token': token, 'user': user});
                }
            });
        }
    }
})

///////////

router.post("/register", async (req, res) => {
    console.log(req.body);
    try{
        const user = new User(req.body);
        user.password = await bcrypt.hash(req.body.password, 10);
        await user.save();
        let newToken = jwt.sign({_id: user._id}, "SHHHZESOD95", {expiresIn:"30 days"});
        res.send({'token': newToken, 'user': user});
    }
    catch(err){
        console.log(err);
        res.status(400).json({err:"האימייל כבר קיים במערכת."});
    }
});

router.post("/check", async(req, res) => {
    
})


module.exports = router;