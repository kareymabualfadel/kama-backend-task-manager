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

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
      // simple protection so someone can't send huge bodies
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });

    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}


function getIdFromUrl(url, prefix) {
  if (!url.startsWith(prefix)) return null;
  const id = url.slice(prefix.length);
  return id ? id : null;
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

  //post 
  if (req.method === "POST" && req.url === "/api/tasks") {
  return (async () => {
    try {
      const body = await readJsonBody(req);

      // Very light validation (not “security”, just correctness)
      if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
        return sendJson(res, 400, { success: false, error: "Title is required" });
      }

      const task = {
        id: String(Date.now()),
        title: body.title.trim(),
        description: typeof body.description === "string" ? body.description.trim() : "",
        status: body.status === "done" ? "done" : "open",
        createdAt: new Date().toISOString(),
      };

      tasks.unshift(task);
      return sendJson(res, 201, { success: true, data: task });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  })();
}

  // DELETE /api/tasks/:id
if (req.method === "DELETE" && req.url.startsWith("/api/tasks/")) {
  const id = getIdFromUrl(req.url, "/api/tasks/");
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return sendJson(res, 404, { success: false, error: "Task not found" });
  }

  tasks.splice(index, 1);
  return sendJson(res, 200, { success: true, message: "Task deleted" });
}

// PUT /api/tasks/:id
if (req.method === "PUT" && req.url.startsWith("/api/tasks/")) {
  return (async () => {
    try {
      const id = getIdFromUrl(req.url, "/api/tasks/");
      const index = tasks.findIndex((t) => t.id === id);

      if (index === -1) {
        return sendJson(res, 404, { success: false, error: "Task not found" });
      }

      const body = await readJsonBody(req);

      // light correctness validation
      if (body.title !== undefined) {
        if (typeof body.title !== "string" || !body.title.trim()) {
          return sendJson(res, 400, { success: false, error: "Title must be a non-empty string" });
        }
      }

      // update only provided fields
      tasks[index] = {
        ...tasks[index],
        ...(body.title !== undefined ? { title: body.title.trim() } : {}),
        ...(body.description !== undefined
          ? { description: typeof body.description === "string" ? body.description.trim() : "" }
          : {}),
        ...(body.status !== undefined ? { status: body.status === "done" ? "done" : "open" } : {}),
      };

      return sendJson(res, 200, { success: true, data: tasks[index] });
    } catch (err) {
      return sendJson(res, 400, { success: false, error: err.message });
    }
  })();
}




  // default: not found
  return sendJson(res, 404, { success: false, error: "Route not found" });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
