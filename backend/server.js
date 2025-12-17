const http = require("http");

// --- Fake DB (backend-side) ---
const tasks = [
  {
    id: "1",
    title: "Learn Express",
    description: "Understand routing and middleware",
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Build CRUD API",
    description: "GET/POST/PUT/DELETE",
    status: "done",
    createdAt: new Date().toISOString(),
  },
];

function sendJson(res, statusCode, payload) {
  // CORS (so the browser frontend can call this API later)
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  // --- ROUTING (manual) ---
  if (req.method === "GET" && req.url === "/api/tasks") {
    return sendJson(res, 200, { success: true, data: tasks });
  }

  // default: not found
  return sendJson(res, 404, { success: false, error: "Route not found" });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
