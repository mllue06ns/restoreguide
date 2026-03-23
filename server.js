const http = require("http");
const fs = require("fs");
const path = require("path");
const { buildPractitionerOutput } = require("./src/decisionEngine");

const publicDir = path.join(__dirname, "public");

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
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

    res.writeHead(200);
    res.end(content);
  });
}

const server = http.createServer((req, res) => {

  if (req.method === "POST" && req.url === "/api/mvp/cfsf/decision") {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const input = JSON.parse(body);

      const decision = buildPractitionerOutput(input);

      sendJson(res, 200, decision);
    });

    return;
  }

  serveStatic(req, res);
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});