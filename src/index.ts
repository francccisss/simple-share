import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import routes from "./routes";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import cookieParser from "cookie-parser";
import authentication from "middelwares/auth/authentication";
import mysql from "mysql2/promise";
import { Database, Files, Users } from "database/database";
import dotenv from "dotenv";
import dr from "utils/dependency_registrar";
import { v4 } from "uuid";
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

dr.registerService("File", new Files(DB));
dr.registerService("Users", new Users(DB));

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
  // renews session if sid exists on client but not on database.
  authentication.renewSession,
  async (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  },
);

app.use("/api", routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log("DIPOTA");
  console.log(err.message);
  res.status(400).send(err.message);
});

http.createServer(app).listen(PORT, () => {
  console.log(`Server start: listening to port ${PORT}`);
});
