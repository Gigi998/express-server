const User = require("../model/User");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(201).json({ message: "No cookies" });
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  // clear cookie if not found
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  // clear user in db
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  await foundUser.save();
  // clear cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ message: "Cookie deleted" });
};

module.exports = { handleLogout };
