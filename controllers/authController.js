const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const handleAuth = async (req, res) => {
  const { user, password } = req.body;
  // Check if user and password are true
  if (!user || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  // Find user
  const userAuth = usersDB.users.find((per) => per.username === user);
  if (!userAuth) return res.sendStatus(401); //Unauthorized
  // Check password
  const match = await bcrypt.compare(password, userAuth.password);
  if (match) {
    res.json({ success: `User ${user} logged in` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleAuth };
