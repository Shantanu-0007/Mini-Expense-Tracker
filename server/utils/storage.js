const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

function getFilePath(filename) {
  return path.join(DATA_DIR, filename);
}

function readJSON(filename) {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJSON(filename, data) {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = { readJSON, writeJSON };