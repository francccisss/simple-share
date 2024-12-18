import { Users } from "database/database";
import express, { Request, Response, NextFunction } from "express";
import dr from "utils/dependency_registrar";
import { v4 } from "uuid";

declare global {
  namespace Express {
    export interface Request {
      hasSID?: boolean;
    }
  }
}

async function checkSession(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.sid === undefined) {
    console.log("Session does not exist: create new session");
    next(); // createSession middleware called
    return;
  }
  next("route");
}
async function createSession(req: Request, res: Response, next: NextFunction) {
  // save to user with session to db

  const users: Users = dr.getService("Users");
  try {
    const sid = await users.insertUserSession();
    res.cookie("sid", sid, {
      httpOnly: true,
    });
    console.log(`New session created with sid: ${sid}`);
    next();
  } catch (err) {
    next(err);
  }
}
async function removeSession(req: Request, res: Response, next: NextFunction) {
  res.clearCookie("sid", { maxAge: -1 });
  console.log(`Cookie cleared`);
  res.status(200).send("Session cleared");
}

async function renewSession(req: Request, res: Response, next: NextFunction) {
  try {
    const clientSid = req.cookies.sid;
    const users: Users = dr.getService("Users");
    const user = await users.getUserSession(clientSid);
    console.log(user);

    if (!user) {
      console.log(
        "Current user has an sid but does not exist in the database: renewing session",
      );
      const sid = await users.insertUserSession();
      res.cookie("sid", sid, {
        httpOnly: true,
      });
      console.log("Session renewed");
    }
    next();
  } catch (err) {
    next(err);
  }
}

export default { checkSession, createSession, removeSession, renewSession };
