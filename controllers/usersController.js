const Users = require("../model/User");

const getAllUsers = async (req, res) => {
  // get all users
  const users = await Users.find();
  if (!users) return res.status(204).json({ message: "There is no users" });
  res.json(users);
};

const deleteUser = async (req, res) => {
  // Check if there is id
  if (!req?.body?.id) res.status(400).json({ message: "Id is required" });
  const id = req.body.id;
  const user = await Users.findOne({ _id: id }).exec();
  if (!user)
    res.status(204).json({ message: `There is no user with id: ${id} ` });
  const result = await Users.deleteOne({ _id: id });
  res.json(result);
};

module.exports = { getAllUsers, deleteUser };
