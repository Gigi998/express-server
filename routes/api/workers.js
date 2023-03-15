const express = require("express");
const path = require("path");
const router = express.Router();
const workersController = require("../../controllers/workersController.js");
const verifyRoles = require("../../middleWare/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

// Chain multiple methods
router
  .route("/")
  .get(workersController.getAll)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    workersController.createNewWorker
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    workersController.updateWorker
  )
  .delete(verifyRoles(ROLES_LIST.Admin), workersController.deletePerson);

router.route("/:id").get(workersController.getSinglePerson);

module.exports = router;
