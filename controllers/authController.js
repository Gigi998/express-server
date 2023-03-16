const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleAuth = async (req, res) => {
  const cookies = req?.cookies;
  console.log(`Cookie at login is  ${JSON.stringify(cookies)}`);
  const { user, password } = req.body;
  // Check if user and password are true
  if (!user || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  // Find user
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // Check password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // Grabing roles
    const roles = Object.values(foundUser.roles);
    // create jwt access and refresh after user is authenticated
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "100s" }
    );
    // New refresh token every time user auth
    let newRefreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Remove received token from db
    const newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    // Clear cookies
    if (cookies?.jwt) {
      /*
      Scenario added here:
        1. User logs in but never uses RT and does not logout
        2. RT is stolen
        3. If 1 & 2, reuse detection is needed to clear all RTs when user logs in
      */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();
      // Detected refresh token reuse
      if (!foundToken) {
        console.log("attempted refresh token reuse at login!");
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    // Update db
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await foundUser.save();
    console.log(foundUser.refreshToken);

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleAuth };
