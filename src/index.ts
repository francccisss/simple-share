import express, { NextFunction, Request, Response } from "express";
import { Http2Server } from "http2";
import routes from "./routes";
import http from "http";
import { networkInterfaces } from "os";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8081;

app.use(express.static(path.join(__dirname, "public"), { index: false }));

// create session middleware
app.get("/", function index(req: Request, res: Response) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api", routes);

http.createServer(app).listen(PORT, () => {
  console.log(`Server start: listening to port ${PORT}`);
});
