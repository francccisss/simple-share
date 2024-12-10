import express from "express";
import api from "./api";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import authentication from "middelwares/auth/authentication";
import mysql from "mysql2/promise";
import { Database, Files, Users } from "database/database";
import dotenv from "dotenv";
import dr from "utils/dependency_registrar";
dotenv.config({ path: ".env" });
const app = express();
const PORT = process.env.PORT || 8081;
const SECRET = "60dcd794-9274-4c1b-b657-d5a27b5d12f5";
const SQLCONN = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASS,
    database: "simple_share",
});
dr.registerService("Database", new Database(SQLCONN));
const DB = dr.getService("Database");
dr.registerService("Files", new Files(DB));
dr.registerService("Users", new Users(DB));
// why is the __dirname not within the scope of esm?
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// why is the __dirname not within the scope of esm?
app.use(express.static(path.join(__dirname, "public"), { index: false }));
app.use(cookieParser(SECRET, {}));
// create session middleware
app.all("*", authentication.checkSession, authentication.createSession);
app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/api", api);
app.use((err, req, res, next) => {
    console.log("DIPOTA");
    console.log(err.message);
    res.status(400).send(err.message);
});
http.createServer(app).listen(PORT, () => {
    console.log(`Server start: listening to port ${PORT}`);
});
