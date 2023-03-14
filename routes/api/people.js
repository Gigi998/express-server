const express = require("express");
const path = require("path");
const router = express.Router();
const data = {};
data.people = require("../../data/people.json");

// Chain multiple methods
router
  .route("/")
  .get((req, res) => {
    res.json(data.people);
  })
  .post((req, res) => {
    res.json({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  })
  .put((req, res) => {
    res.json({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
  })
  .delete((req, res) => {
    res.json({
      id: req.body.id,
    });
  });

router.route("/:id").get((req, res) => {
  res.json({ id: req.params.id });
});

module.exports = router;
