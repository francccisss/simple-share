import express, { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";

function checkSession(req: Request, res: Response, next: NextFunction) {
  console.log(req.cookies);
  if (req.cookies === null || req.signedCookies === null) {
    console.log("Session does not exist: create new session");
    next();
    return;
  }
  console.log("Session exists proceed to `/`");
  next("route");
}
function createSession(req: Request, res: Response, next: NextFunction) {
  const sid = v4();
  res.cookie("sid", sid, {
    httpOnly: true,
  });
  next();
  console.log(`New session created with sid: ${sid}`);
}
function removeSession(req: Request, res: Response, next: NextFunction) {
  res.clearCookie("sid", { maxAge: -1 });
  console.log(`Cookie cleared`);
  res.status(200).send("Session cleared");
}

export default { checkSession, createSession, removeSession };
