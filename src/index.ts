import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import { Http2Server } from "http2";
import routes from "./routes";
import http from "http";
import { networkInterfaces } from "os";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { deflateSync } from "zlib";
import fs from "fs/promises";
import cookieParser from "cookie-parser";
import utils from "utils";
import DR from "utils/DR";
import authentication from "middelwares/auth/authentication";
import mysql from "mysql2/promise";
import { exit } from "process";
import { Database, Files, Users } from "database/database";
import dotenv from "dotenv";
import DepRegistrar from "utils/DR";
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

DepRegistrar.registerService("Database", new Database(SQLCONN));
const DB = DR.getService("Database");

DepRegistrar.registerService("File", new Files(DB));
DepRegistrar.registerService("Users", new Users(DB));
console.log(DepRegistrar.getService("Users"));

// why is the __dirname not within the scope of esm?
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// why is the __dirname not within the scope of esm?

app.use(express.static(path.join(__dirname, "public"), { index: false }));
app.use(cookieParser(SECRET, {}));

// create session middleware
app.get("/", authentication.checkSession, authentication.createSession);

app.get(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Check database when user session exists from client");
      next();
    } catch (err) {
      next(err);
    }
  },
  async (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  },
);

app.use("/api", routes);

app.use((err: any, req: Request, res: Response) => {
  console.log(err.message);
  res.status(400).send(err.message);
});

http.createServer(app).listen(PORT, () => {
  console.log(`Server start: listening to port ${PORT}`);
});
