const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
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
            jwt.sign({_id: user._id}, process.env.S, {expiresIn:"30 days"},(err, token) => {
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
    try{
        let user1 = await User.find({email: req.body.email});
        if(user1.length != 0){
            throw new Error('Required');
        }else{
            const user = new User(req.body);
            user.password = await bcrypt.hash(req.body.password, 10);
            await user.save();
            let newToken = jwt.sign({_id: user._id}, process.env.S, {expiresIn:"30 days"});
            res.send({'token': newToken, 'user': user});
        }
    }
    catch(err){
        res.send(err);
    }
});

router.post("/check", async(req, res) => {
    
})


module.exports = router;