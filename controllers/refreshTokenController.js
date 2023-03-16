const User = require("../model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  // delete cookie
  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Token expired, reuse token
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) res.sendStatus(403);
        // FInd user
        // console.log("Attempted refresh token reuse!");
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();
        // Delete all tokens
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    );
    return res.sendStatus(403);
  }
  // Creating refresh token arr without received token
  const newRefresTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  // check jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        // console.log("expired refresh token");
        foundUser.refreshToken = [...newRefresTokenArray];
        const result = await foundUser.save();
        // console.log(result);
      }
      if (err || foundUser.username !== decoded.username)
        return res.sendStatus(403);
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      // We want to create newRefreshtoken every refresh
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Update db
      foundUser.refreshToken = [...newRefresTokenArray, newRefreshToken];
      await foundUser.save();

      // Create new cookie
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
