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

/* 🔥 ROBUST GOOGLE DRIVE PDF PROXY */
app.get("/pdf", (req, res) => {
  const fileId = "10md4h5_xQLxWtrfb-FS7EN7-fUFOiMj9";
  const url = `https://drive.google.com/uc?export=download&id=${fileId}`;

  function fetchPDF(downloadUrl) {
    https.get(downloadUrl, response => {
      // Handle redirect
      if (response.statusCode === 302 || response.statusCode === 301) {
        fetchPDF(response.headers.location);
        return;
      }

      // Validate PDF
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("application/pdf")) {
        res.status(500).send("Google Drive did not return a PDF file");
        return;
      }

      res.setHeader("Content-Type", "application/pdf");
      response.pipe(res);
    }).on("error", err => {
      res.status(500).send("Failed to fetch PDF");
    });
  }

  fetchPDF(url);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
