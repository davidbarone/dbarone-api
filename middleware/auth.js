const jwt = require("jsonwebtoken");

const secretKey = process.env.APP_SECRET_KEY;

module.exports = function(req, res, next) {
  //get the token from the header if present
  let token = req.headers["x-auth-token"] || req.headers["authorization"];

  if (token && token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length).trim();
  }

  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    res.status(400).send("Invalid token.");
  }
};
