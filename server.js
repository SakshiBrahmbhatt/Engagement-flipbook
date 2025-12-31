const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

/*
  Serve everything inside /public
  This includes:
  - index.html
  - style.css
  - app.js (ES module)
  - lib/pdf.mjs
  - lib/pdf.worker.mjs
  - lib/turn.min.js
*/
app.use(express.static(path.join(__dirname, "public")));

/*
  Root route
*/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/*
  Start server
*/
app.listen(PORT, () => {
  console.log(`🚀 Engagement flipbook running on http://localhost:${PORT}`);
});
