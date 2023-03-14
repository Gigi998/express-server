const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromise = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;
  const foundUser = usersDB.users.find(
    (per) => per.refreshToken === refreshToken
  );
  // clear cookie if not found
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }
  const otherUsers = usersDB.users.filter(
    (per) => per.refreshToken !== foundUser.refreshToken
  );
  // clear user
  const currentUser = {
    ...foundUser,
    refreshToken: "",
  };
  // update db
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromise.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(usersDB.users)
  );
  res.clearCookie("jwt", {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.sendStatus(204);
};

module.exports = { handleLogout };
