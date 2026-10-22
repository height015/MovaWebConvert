import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || "3000", 10);
const HOST = process.env.HOST || "localhost";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject"
};

const server = http.createServer((req, res) => {
  // CORS and basic security headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  // Parse URL pathname
  const parsedUrl = new URL(req.url, `http://${req.headers.host || HOST}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Safety: prevent directory traversal
  const directSafePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
  let filePath = path.join(__dirname, directSafePath);

  // If the direct path does not exist on disk, check if it's a virtual locale prefix
  if (!fs.existsSync(filePath)) {
    const localeRegex = /^\/(en-ng|en-gh|en-ke|en-za|en-gb|en)(\/.*)?$/i;
    const match = pathname.match(localeRegex);
    if (match) {
      const strippedPath = match[2] || "/";
      const fallbackSafePath = path.normalize(strippedPath).replace(/^(\.\.[\/\\])+/, "");
      const fallbackPath = path.join(__dirname, fallbackSafePath);
      if (fs.existsSync(fallbackPath) || fs.existsSync(fallbackPath + ".html") || fs.existsSync(path.join(fallbackPath, "index.html"))) {
        filePath = fallbackPath;
      }
    }
  }

  // Check file stat
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    } else if (err && !path.extname(filePath)) {
      // If path has no extension, try directory index or .html file
      const htmlCandidate = filePath + ".html";
      const dirIndexCandidate = path.join(filePath, "index.html");
      if (fs.existsSync(dirIndexCandidate)) {
        filePath = dirIndexCandidate;
      } else if (fs.existsSync(htmlCandidate)) {
        filePath = htmlCandidate;
      }
    }

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        // Serve custom 404 page if exists
        const notFoundPath = path.join(__dirname, "404.html");
        fs.readFile(notFoundPath, (err404, content404) => {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          if (!err404) {
            res.end(content404);
          } else {
            res.end("<h1>404 Not Found</h1><p>The page you requested could not be found.</p>");
          }
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\n  🚀 Mova Website is running locally!`);
  console.log(`  👉 Local:   http://${HOST}:${PORT}`);
  console.log(`  👉 Network: http://127.0.0.1:${PORT}\n`);
  console.log(`  Zero-dependency Vanilla HTML5 + CSS + JavaScript stack.\n`);
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    const nextPort = PORT + 1;
    console.log(`Port ${PORT} is in use, trying port ${nextPort}...`);
    server.listen(nextPort, HOST);
  } else {
    console.error("Server error:", e);
  }
});
