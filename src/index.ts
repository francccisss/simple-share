import express, { Request, Response } from "express";
import { Http2Server } from "http2";
import routes from "./routes";
import http from "http";
import { networkInterfaces } from "os";

const app = express();
const PORT = process.env.PORT || 8081;

app.get("/", routes.index);

http.createServer(app).listen(PORT, () => {
  console.log(`Server start: listening to port ${PORT}`);
});
