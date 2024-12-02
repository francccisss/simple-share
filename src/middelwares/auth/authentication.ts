import express, { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";

declare global {
  namespace Express {
    export interface Request {
      hasSID?: boolean;
    }
  }
}
function checkSession(req: Request, res: Response, next: NextFunction) {
  const isCookieEmpty = (cookie: { [key: string]: any }): boolean => {
    return Object.keys(cookie).length === 0;
  };
  console.log(req.cookies);
  if (isCookieEmpty(req.cookies) === true) {
    console.log("Session does not exist: create new session");
    next(); // createSession middleware called
    return;
  }
  next("route"); // move to database check route handler
}
function createSession(req: Request, res: Response, next: NextFunction) {
  // save to user with session to db

  const sid = v4();
  res.cookie("sid", sid, {
    httpOnly: true,
  });
  console.log(`New session created with sid: ${sid}`);
  next();
}
function removeSession(req: Request, res: Response, next: NextFunction) {
  res.clearCookie("sid", { maxAge: -1 });
  console.log(`Cookie cleared`);
  res.status(200).send("Session cleared");
}

export default { checkSession, createSession, removeSession };
