const express = require("express");
const path = require("path");
const app = express();
const PORT = 4000;

app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
