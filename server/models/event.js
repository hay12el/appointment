const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    admin: String,
    time: Date,
    connectTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Event = new mongoose.model("Event", eventSchema);

module.exports = Event;
