const express = require("express");
const path = require("path");
const router = express.Router();
const peopleController = require("../../controllers/peopleController.js");
const verifyRoles = require("../../middleWare/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

// Chain multiple methods
router
  .route("/")
  .get(peopleController.getAll)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    peopleController.createNewPerson
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    peopleController.updatePerson
  )
  .delete(verifyRoles(ROLES_LIST.Admin), peopleController.deletePerson);

router.route("/:id").get(peopleController.getSinglePerson);

module.exports = router;
