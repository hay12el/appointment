const eventsR = require("./events");
const usersR = require("./users");

exports.routesInit = (app) => {
    app.use("/events", eventsR);
    app.use("/users", usersR);
}