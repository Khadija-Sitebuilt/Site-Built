const fs = require("fs");
const path = require("path");

const target = path.join(
  __dirname,
  "..",
  "node_modules",
  "next",
  "dist",
  "compiled",
  "http-proxy",
  "index.js",
);
if (!fs.existsSync(target)) {
  console.error("Target file not found:", target);
  process.exit(1);
}
let src = fs.readFileSync(target, "utf8");
const before = /r\(837\)\._extend/g;
if (!before.test(src)) {
  console.log("No occurrences of r(837)._extend found — nothing to change.");
  process.exit(0);
}
src = src.replace(before, "(function(a,b){return Object.assign(a,b)})");
fs.writeFileSync(target, src, "utf8");
console.log("Patched", target);
