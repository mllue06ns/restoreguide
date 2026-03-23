const http = require("http");
const fs = require("fs");
const path = require("path");
const { buildPractitionerOutput } = require("./src/decisionEngine");

const publicDir = path.join(__dirname, "public");

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
}

function serveStatic(req, res) {
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(publicDir, filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    const contentType =
      ext === ".html" ? "text/html" :
      ext === ".css" ? "text/css" :
      ext === ".js" ? "application/javascript" :
      "text/plain";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/mvp/cfsf/decision") {
    let body = "";
    req.on("data", chunk => body += chunk.toString());

    req.on("end", () => {
      try {
        const input = JSON.parse(body);
        const decision = buildPractitionerOutput(input);
        sendJson(res, 200, decision);
      } catch (e) {
        sendJson(res, 400, { error: "Invalid request" });
      }
    });
    return;
  }

  serveStatic(req, res);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`RestoreGuide running on port ${PORT}`);
});
