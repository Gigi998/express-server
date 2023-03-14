const express = require("express");
const path = require("path");
const app = express();
const errorHandler = require("./middleWare/errorHandler");
const PORT = 4000;

// Middleware for json
app.use(express.json());

app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.use("/", require("./routes/root"));
app.use("/people", require("./routes/api/people"));

// Catching 404
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

// Server error catching
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
