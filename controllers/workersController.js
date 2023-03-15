const Worker = require("../model/Worker");

const getAll = async (req, res) => {
  // Get all users
  const workers = await Worker.find();
  if (!workers) return res.status(204).json({ message: "No users in DB" });
  res.json(workers);
};

const createNewWorker = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First name and last name fields are required" });
  }
  try {
    const result = await Worker.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateWorker = async (req, res) => {
  // Check if id is in body
  if (!req?.body?.id) return res.send(400).json({ message: "Id is required" });
  const id = req.body.id;
  // Check if there is worker with the id we recived
  const worker = await Worker.findOne({ _id: id }).exec();
  if (!worker) res.status(400).json({ message: `Employee ID ${id} not found` });
  // Update properties
  if (req.body?.firstname) worker.firstname = req.body.firstname;
  if (req.body?.lastname) worker.lastname = req.body.lastname;
  const result = await worker.save();
  res.json(result);
};

const deletePerson = async (req, res) => {
  // Check if id is in body
  if (!req?.body?.id) return res.send(400).json({ message: "Id is required" });
  const id = req.body.id;
  // Check if there is worker with the id we recived
  const worker = await Worker.findOne({ _id: id }).exec();
  if (!worker) res.status(400).json({ message: `Employee ID ${id} not found` });
  const result = await worker.deleteOne({ _id: id });
  res.json(result);
};

const getSinglePerson = async (req, res) => {
  // Check if id is in body
  if (!req?.params?.id)
    return res.send(400).json({ message: "Id is required" });
  const id = req.params.id;
  // Check if there is worker with the id we recived
  const worker = await Worker.findOne({ _id: id }).exec();
  if (!worker) res.status(400).json({ message: `Employee ID ${id} not found` });
  res.json(worker);
};

module.exports = {
  getAll,
  createNewWorker,
  updateWorker,
  deletePerson,
  getSinglePerson,
};
