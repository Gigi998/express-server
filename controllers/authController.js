const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

const handleAuth = async (req, res) => {
  const { user, password } = req.body;
  // Check if user and password are true
  if (!user || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  // Find user
  const foundUser = usersDB.users.find((per) => per.username === user);
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
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // FInd other users
    const otherUsers = usersDB.users.filter(
      (per) => per.username !== foundUser.username
    );
    // Adding refreshtoken to current user
    const currentUser = { ...foundUser, refreshToken };
    // Adding current to all users
    usersDB.setUsers([...otherUsers, currentUser]);
    // Store changes in users.json
    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleAuth };
