const jwt = require("jsonwebtoken");

exports.authToken = async (req, res, next) => {
  const token = req.body.token;
  if (token) {
    jwt.verify(token, process.env.S, (err, authorizedData) => {
      if (err) {
        //If error send Forbidden (403)
        console.log("ERROR: Could not connect to the protected route");
        //res.sendStatus(403);
      } else {
        //If token is successfully verified, we can send the autorized data
        req.user = authorizedData;
        //res.json({message: 'Successful log in'});
      }
    });
  } else {
    //If header is undefined return Forbidden (403)
    console.log("problem in authToken!");
  }
  next();
};
