const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  //   console.log(req.headers["authorization"]);
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);
  const bearerToken = authHeader.split(" ")[1];
  jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // console.log(decoded);
    if (err) return res.sendStatus(403);
    req.user = decoded.username;
    next();
  });
};

module.exports = { verifyJWT };
