const esbuild = require("esbuild");
const fs      = require("fs");
const path    = require("path");

const dist = path.join(__dirname, "dist");
if (!fs.existsSync(dist)) fs.mkdirSync(dist);

esbuild.buildSync({
  entryPoints: ["src/index.jsx"],
  bundle:      true,
  minify:      true,
  platform:    "browser",
  target:      "es2017",
  outfile:     "dist/bundle.js",
  jsx:         "automatic",
  define:      { "process.env.NODE_ENV": '"production"' },
});

fs.copyFileSync("public/index.html", "dist/index.html");

const logosSrc  = path.join(__dirname, "public/logos");
const logosDist = path.join(dist, "logos");
if (!fs.existsSync(logosDist)) fs.mkdirSync(logosDist);
fs.readdirSync(logosSrc).forEach(f => {
  fs.copyFileSync(path.join(logosSrc, f), path.join(logosDist, f));
});

console.log("✓ Build complete → dist/");
