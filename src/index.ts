import express, { NextFunction, Request, Response } from "express";
import { Http2Server } from "http2";
import routes from "./routes";
import http from "http";
import { networkInterfaces } from "os";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { deflateSync } from "zlib";
import fs from "fs/promises";

const app = express();
const PORT = process.env.PORT || 8081;

// why is the __dirname not within the scope of esm?
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// why is the __dirname not within the scope of esm?

app.use(express.static(path.join(__dirname, "public"), { index: false }));

// create session middleware
app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//app.get("/test", async (req: Request, res: Response) => {
//  const file = path.join(__dirname, "./leaves_green_dark_145996_3840x2400.jpg");
//  const read = await fs.readFile(file);
//  res.send(read.toString());
//});

app.use("/api", routes);

http.createServer(app).listen(PORT, () => {
  console.log(`Server start: listening to port ${PORT}`);
});
