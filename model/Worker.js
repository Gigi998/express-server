const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workerSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Worker", workerSchema);
