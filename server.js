import http from "node:http";
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

await db.query(
  "INSERT INTO contacts(name, email, phone_number) VALUES ($1,$2,$3)",
  ["Nuhamin", "nuhamin@getMaxListeners.com", "0911202020"],
);

const result = await db.query("SELECT * FROM contacts");

console.table(result.rows);

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/contacts") {
    const result = await db.query("SELECT * FROM contacts");

    console.log(result.rows);

    res.statusCode(200);
    res.end(JSON.stringify(result.rows));
    return;
  }

  if (req.method === "POST" && req.url === "/contacts") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const data = JSON.parse(body);

      await db.query(
        "INSERT INTO contacts(name, email, phone_number) VALUES ($1,$2,$3)",
        [data.name, data.email, data.phone_number],
      );

      res.statusCode(201);
      res.end(JSON.stringify({ message: "Contact added" }));
    });

    return;
  }

  res.statusCode(404);
  res.end(JSON.stringify({ message: "Page not found" }));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
