const express = require("express");
const path = require("path");
const https = require("https");

const app = express();
const PORT = process.env.PORT || 3000;

/* Serve frontend */
app.use(express.static(path.join(__dirname, "public")));

/* Root */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* 🔥 PDF PROXY (FIXES CORS) */
app.get("/pdf", (req, res) => {
  const fileId = "10md4h5_xQLxWtrfb-FS7EN7-fUFOiMj9";
  const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  https.get(driveUrl, driveRes => {
    res.setHeader("Content-Type", "application/pdf");
    driveRes.pipe(res);
  }).on("error", err => {
    res.status(500).send("Failed to load PDF");
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
