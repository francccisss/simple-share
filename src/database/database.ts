import { Connection, QueryResult, FieldPacket } from "mysql2/promise";
import { v4 } from "uuid";
import "../types";

import { exit } from "process";
import { file, user } from "../types";

export class Database {
  session: Connection;
  constructor(sqlConn: Connection) {
    this.session = sqlConn;
  }

  async connect() {
    try {
      this.session.connect();
    } catch (err) {
      const error = err as Error;
      console.error("Unable to connect to the mysql server");
      console.error(err);
      console.error("Exiting application");
      exit();
    }
  }
  async disconnect() {}

  // executes script
  async exec(stmt: string, values?: any | Array<any>): Promise<any> {
    try {
      const [results, fields] = await this.session.query(stmt, values);
      console.log(`From EXEC: `);
      console.log({ results, fields });
      return results;
    } catch (err) {
      console.error(err);
      console.error("Unable execute query");
      return [];
    }
  }
}

export class Users {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
  async insertUserSession(): Promise<string> {
    const newSessionId = v4();
    const results = await this.db.exec(
      "insert into user (sessionID, status, userTimeout, fileSizeContained) values (?, ?, ?, ?)",
      [newSessionId, 1, 0, 0],
    );
    if (results.length == 0) {
      throw new Error("Unable to insert a new session");
    }
    return newSessionId;
  }
  async checkUserSession(sessionID: string): Promise<boolean> {
    const results = await this.db.exec(
      `select sessionID from user where sessionID = ?`,
      sessionID,
    );
    return results.length != 0;
  }
  async updateUserSession(
    sid: string,
    updates:
      | {
          sessionID?: string;
          status?: 0 | 1;
          userTimeout?: number;
          fileSizeContained?: number;
        }
      | ((currentState: user) => {
          sessionID?: string;
          status?: 0 | 1;
          userTimeout?: number;
          fileSizeContained?: number;
        }),
  ) {
    // STRING INTERPOLATION IS NOT SAFE DAW
    if (typeof updates === "function") {
      console.log("updates argument is type of function");
      const results: Array<user> = await this.db.exec(
        `select * from user where sessionID = ?`,
        [sid],
      );
      if (results.length === 0) {
        throw new Error("Unable to get current user state to be updated");
      }
      updates = updates(results[0]);
    }
    const update = await this.db.exec(
      `update user set ${this.compoundUpdates(updates)} where sessionID = ?`,
      [sid],
    );
    if (update.length == 0) {
      throw new Error("Unable to update user: " + sid);
    }
    console.log("Successfully updated:", sid);
    console.log({ update });
  }
  private compoundUpdates(updates: { [key: string]: any }) {
    return Object.entries(updates)
      .map(([key, value]) => `${key} = ${value}`)
      .join(",");
  }
  async deleteUserSession(sid: string) {
    this.db.exec(`DELETE users FILES WHERE id = ${sid}`);
  }
}

export class Files {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  // string as binary string
  async insertFile(file: Buffer, sid: string): Promise<string> {
    const fileID = v4();
    const results = await this.db.exec(
      "insert into file (expiration, ownerID, fileBuffer, fileID) values (?, ?, ?, ?)",
      [0, sid, file, fileID],
    );
    if (results.length == 0)
      throw new Error("Unable to insert a new file for user: " + sid);

    console.log("Successfully inserted new file for user: ", sid);
    return fileID;
  }
  async getFile(fileID: string): Promise<file> {
    const results: Array<file> = await this.db.exec(
      "select * from file where fileID = ?",
      [fileID],
    );
    if (results.length == 0)
      throw new Error("Unable to query file with id of " + fileID);

    console.log("Successfully queuried file ", fileID);
    return results[0];
  }

  async getFiles(file: any, sid: string): Promise<Array<file>> {
    const results = await this.db.exec("select * from file where ownerID = ?", [
      sid,
    ]);
    if (results.length == 0)
      throw new Error("Unable to query file collection with ownerID of " + sid);

    console.log("Successfully queuried file collection for user: ", sid);
    return results;
  }
  async delete(file: any, user: string) {
    this.db.exec(`DELETE FROM FILES WHERE f.id = ${file.id}`);
  }
  async clearRelatedItems() {}
}
