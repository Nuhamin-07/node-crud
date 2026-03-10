import http from "node:http";
import path from "node:path";
import fs from "node:fs/promises";
import db from "./db.js";

const PORT = 8000;

await db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone_number TEXT
  );
`);

// await db.query(
//   "INSERT INTO contacts(name, email, phone_number) VALUES ($1,$2,$3)",
//   ["Nuhamin", "nuhamin@getMaxListeners.com", "0911202020"],
// );

const __dirname = import.meta.dirname;
const pathname = path.join(__dirname, "public", "index.html");
console.log(__dirname);
console.log("pathname ", path.extname(pathname));

const server = http.createServer(async (req, res) => {
  try {
    let filePath = path.join(__dirname, "public", req.url);

    if (req.url === "/") {
      filePath = path.join(__dirname, "public", "index.html");
    }

    if (req.url === "/newContact" && req.method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const data = JSON.parse(body);

          // Insert new contact
          await db.query(
            "INSERT INTO contacts(name, email, phone_number) VALUES ($1,$2,$3)",
            [data.name, data.email, data.phone_number],
          );

          // Fetch all contacts AFTER insertion
          const result = await db.query("SELECT * FROM contacts");

          // Log inserted data
          console.log("Contact inserted successfully!");
          console.table(result.rows);

          // Respond to frontend
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Contact added successfully" }));
        } catch (err) {
          console.error("Error inserting contact:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Server error" }));
        }
      });

      return; // important so it doesn’t continue to static file serving
    }

    const ext = path.extname(filePath);

    const mimeTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".svg": "image/svg+xml",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    const file = await fs.readFile(filePath);

    res.writeHead(200, { "Content-Type": contentType });
    res.end(file);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
