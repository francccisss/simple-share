import express from "express";
import routes from "./routes";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import DR from "utils/DR";
import authentication from "middelwares/auth/authentication";
import mysql from "mysql";
import { exit } from "process";
const app = express();
const PORT = process.env.PORT || 8081;
const SECRET = "60dcd794-9274-4c1b-b657-d5a27b5d12f5";
const SQLCONN = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mosqueda1",
    database: "simple_share",
});
if (SQLCONN.state !== "connected" && SQLCONN.state !== "authenticated") {
    console.error("Unable to connect to the mysql server");
    console.error("Exiting application");
    exit();
}
// why is the __dirname not within the scope of esm?
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// why is the __dirname not within the scope of esm?
app.use(express.static(path.join(__dirname, "public"), { index: false }));
app.use(cookieParser(SECRET, {}));
// create session middleware
app.get("/", authentication.checkSession, authentication.createSession);
app.get("/", (req, res, next) => {
    try {
        console.log(DR.getService("Database"));
        console.log("Check database when user session exists from client");
        next();
    }
    catch (err) {
        next(err);
    }
}, async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/api", routes);
app.use((err, req, res) => {
    console.log(err.message);
    res.status(400).send(err.message);
});
http.createServer(app).listen(PORT, () => {
    console.log(`Server start: listening to port ${PORT}`);
});
