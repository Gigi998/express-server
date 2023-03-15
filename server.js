const express = require("express");
const path = require("path");
const app = express();
const errorHandler = require("./middleWare/errorHandler");
const { verifyJWT } = require("./middleWare/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = 4000;

// DB connection
connectDB();

app.use(express.urlencoded({ extended: false }));

// Middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// Token veification is happening only on peole route
app.use(verifyJWT);
app.use("/workers", require("./routes/api/workers"));

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

// Only listen to port if we are connected
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
