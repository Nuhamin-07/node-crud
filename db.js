import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";

const db = new PGlite("./mydb");

export default db;
