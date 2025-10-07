const http = require("http");
const PORT = 4000;
const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type":"application/json"});
  res.end(JSON.stringify({ ok: true, pid: process.pid }));
});
server.listen(PORT, "0.0.0.0", () => {
  console.log("test_server listening on", PORT, "pid", process.pid);
});
