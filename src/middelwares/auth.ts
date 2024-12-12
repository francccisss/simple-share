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
  // skip the session check
  if (req.url.includes("/api/share")) {
    console.log("Sharing is caring");
    return next("route");
  }

  const sid = req.cookies.sid;
  console.log("Checking user session");
  if (sid === undefined) {
    console.log("Session does not exist: create new session");
    next(); // createSession middleware called
    return;
  }
  const users: Users = dr.getService("Users");
  const user = await users.checkUserSession(sid);
  console.log({ userexists: user });
  // check IP??
  if (!user) {
    console.log("User sessionID is invalid, creating new session...");
    console.log("Renewing session");
    next(); // createSession middleware called
    return;
  }
  console.log("User session valid");
  next("route");
}
async function createSession(req: Request, res: Response, next: NextFunction) {
  const users: Users = dr.getService("Users");
  try {
    const sid = await users.insertUserSession();
    console.log({ newID: sid });
    req.cookies.sid = sid; // update sid for the next route handler
    console.log(`New session created with sid: ${sid}`);

    res.cookie("sid", sid, {
      httpOnly: true,
    });

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

export default { checkSession, createSession, removeSession };
