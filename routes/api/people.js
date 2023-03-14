const express = require("express");
const path = require("path");
const router = express.Router();
const peopleController = require("../../controllers/peopleController.js");

// Chain multiple methods
router
  .route("/")
  .get(peopleController.getAll)
  .post(peopleController.createNewPerson)
  .put(peopleController.updatePerson)
  .delete(peopleController.deletePerson);

router.route("/:id").get(peopleController.getSinglePerson);

module.exports = router;
