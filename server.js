const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const downloadDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

// ambil info video
app.post("/api/info", (req, res) => {
  const { url } = req.body;
  exec(`yt-dlp -j "${url}"`, (err, stdout) => {
    if (err) return res.status(500).json({ error: "error" });
    const data = JSON.parse(stdout);
    res.json({
      title: data.title,
      thumbnail: data.thumbnail
    });
  });
});

// download video
app.post("/api/download", (req, res) => {
  const { url } = req.body;
  const file = Date.now();
  const filePath = `${downloadDir}/${file}.mp4`;

  exec(`yt-dlp -f mp4 -o "${filePath}" "${url}"`, () => {
    res.download(filePath, () => fs.unlinkSync(filePath));
  });
});

app.listen(3000, () => console.log("Server running"));
