const express = require("express");
const Event = require('../models/event');
const User = require("../models/user");
const bodyParser = require("body-parser");
const { response } = require("express");

const router = express.Router();

router.use(bodyParser.json());
router.use(express.json());

router.use(bodyParser.urlencoded({
    extended: true
}));


/////////////////

router.post("/getDayQueues", async (req, res) => {
    const dateObj = new Date(req.body.date);
    const month = dateObj.getUTCMonth(); //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const Day = new Date(year, month, day, 00);
    const nextDay = new Date(year, month, day + 1, 00);
    console.log(req.body.admin);
    await Event.find({admin: req.body.admin, time: {$gte: Day, 
                                           $lt: nextDay}}).then((response) => {
                                               const hours = response.map(x => new Date(x.time))
                                               const hoursToReturn = hours.map(x => x.getUTCHours())
                                               return res.send({"events": hoursToReturn})
                                           }).catch((err)=>{
                                               console.log(err);
                                           })
               
})



/////////////////

router.post("/addQueue", async (req, res) => {
    const dateObj = new Date(req.body.time);
    const month = dateObj.getUTCMonth(); //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const hourN = req.body.hour;
    const time = new Date(year, month, day, hourN + 3);
   
    let tomorowDate = new Date(year, month, day + 5, hourN + 3);
    let yesterdayDate = new Date(year, month, day - 5, hourN + 3);

    await User.findOne({ _id: req.body.user.id })
    .populate({path: 'queues',
               match: { time: {$gte: yesterdayDate, $lt: tomorowDate}}})
    .exec((err, queueList) => {
        if (err) {
            res.send(err);
        }
        if(queueList.queues.length != 0){
            res.send("מינימום שבוע בין שני תורים");
        }else{
            const queue = new Event({
                admin: req.body.user.myAdmin,
                time: time,
                connectTo: req.body.user.id
            });
            queue.save();
            User.findOneAndUpdate({ _id: req.body.user.id }, { $push: { queues: queue } }, (err) => {
                if (!err) {
                    console.log("Success");
                } else {
                    console.log("No Success");
                }
            });
            

            res.send(queue);
        }
    });
    
    
    
})

///////////////

router.post("/deleteQueue", async (req, res) => {

    Event.findOneAndDelete({ _id: req.body.id }, (err) => {
        if (!err) {
            console.log("deleted from events");
        } else {
            console.log("No Success");
        }
    });

    await User.findOneAndUpdate({ _id: req.body.user.id }, { $pull: {queues: req.body.id}})
    .then((response) => {
        console.log("deleted from user");
    })
    .catch((err) => {
        console.log(err);
    });
    
    await User.findOne({ _id: req.body.user.id }).populate('queues').exec((err, queueList) => {
        if (err) {
            res.send(err);
        }
        res.send(queueList.queues);
    });
})

///////////////

router.post("/AdminDeleteQueue", async (req, res) => {
    Event.findOneAndDelete({ _id: req.body.postid }, (err) => {
        if (!err) {
            console.log("deleted from events");
        } else {
            console.log("No Success");
        }
    });

    await User.findOneAndUpdate({ _id: req.body.userid }, { $pull: {queues: req.body.postid}})
    .then((response) => {
        console.log("deleted from user");
    })
    .catch((err) => {
        console.log(err);
    });
    
    const Theuser = async(x) => { 
        return await User.find({_id: x});
    }
    const dateObj = new Date(req.body.date);
    const month = dateObj.getUTCMonth(); //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const Day = new Date(year, month, day, 00);
    const nextDay = new Date(year, month, day + 1, 00);
    await Event.find({time: {$gte: Day, 
                                $lt: nextDay}}).then(async(response) => {
                                               const s = [];
                                               
                                               for (var i = 0; i < response.length; i++) {
                                                    const temp = {};
                                                    temp["postId"] = response[i]._id
                                                    const h = new Date(
                                                      response[i].time
                                                    );
                                                    temp["hour"] = h.getUTCHours();
                                                    h = (response[i].connectTo).toString();
                                                    console.log(h);
                                                    temp["user"] = await Theuser(h);
                                                    s.push(temp);
                                               } 
                                               const hours = response.map(x => new Date(x.time))
                                               const hoursToReturn = hours.map(x => x.getUTCHours())
                                               return res.send({"events": s})
                                           }).catch((err)=>{
                                               console.log(err);
                                           })
                  
})

///////////////

router.post("/AdminCatchQueue", async (req, res) => {
    const dateObj = new Date(req.body.date);
    const month = dateObj.getUTCMonth(); //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const hourN = req.body.hour;
    const time = new Date(year, month, day, hourN);

    const queue = new Event({
        admin: req.body.userid,
        time: time,
        connectTo: req.body.userid
    });
    queue.save();
    User.findOneAndUpdate({ _id: req.body.userid }, { $push: { queues: queue } }, (err) => {
        if (!err) {
            console.log("Success");
        } else {
            console.log("No Success");
        }
    });

    const Theuser = async(x) => { 
        return await User.find({_id: x});
    }
    const Day = new Date(year, month, day, 00);
    const nextDay = new Date(year, month, day + 1, 00);
    await Event.find({time: {$gte: Day, 
                                $lt: nextDay}}).then(async(response) => {
                                               const s = [];
                                               console.log(response);
                                               for (const i = 0; i < response.length; i++) {
                                                    const temp = {};
                                                    temp["postId"] = response[i]._id
                                                    const h = new Date(response[i].time);
                                                    temp["hour"] = h.getUTCHours();
                                                    h = (response[i].connectTo).toString();
                                                    console.log(h);
                                                    temp["user"] = await Theuser(h);
                                                    s.push(temp);
                                               } 
                                               const hours = response.map(x => new Date(x.time))
                                               const hoursToReturn = hours.map(x => x.getUTCHours())
                                               return res.send({"events": s})
                                           }).catch((err)=>{
                                               console.log(err);
                                           })
                  
})

///

router.post("/AdminGetDayQueues", async (req, res) => {
    const Theuser = async(x) => { 
        return await User.find({_id: x});
    }
    
    const dateObj = new Date(req.body.date);
    const month = dateObj.getUTCMonth(); //months from 1-12
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();
    const Day = new Date(year, month, day, 00);
    const nextDay = new Date(year, month, day + 1, 00);
    const id = req.body.user;
    await Event.find({admin: id,time: {$gte: Day, 
                                $lt: nextDay}}).then(async(response) => {
                                               const s = [];
                                               
                                               for (var i = 0; i < response.length; i++) {
                                                    const temp = {};
                                                    temp["postId"] = response[i]._id
                                                    const h = new Date(
                                                      response[i].time
                                                    );
                                                    temp["hour"] = h.getUTCHours();
                                                    h = (response[i].connectTo).toString();
                                                    
                                                    temp["user"] = await Theuser(h);
                                                    s.push(temp);
                                               } 
                                               const hours = response.map(x => new Date(x.time))
                                               const hoursToReturn = hours.map(x => x.getUTCHours())
                                               return res.send({"events": s})
                                           }).catch((err)=>{
                                               console.log(err);
                                           })
               
})

///////////////

router.post('/getMyQueue', async (req, res) => {
    const today = new Date();
    const yesterday = today - 24 * 60 * 60 * 1000;
    const yesterdayDate = new Date(yesterday);
    const myQueues = await User.findOne({ _id: req.body.user.id })
      .populate({ path: "queues", match: { time: { $gte: yesterdayDate } } })
      .sort("-date")
      .exec((err, queueList) => {
        if (err) {
          res.send(err);
        }
        res.send(queueList.queues);
      });
});

module.exports = router;