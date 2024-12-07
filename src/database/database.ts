import { Connection, QueryResult, FieldPacket } from "mysql2/promise";
import { v4 } from "uuid";
import "../types";

import { exit } from "process";
import { user } from "../types";

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
      "insert into user (sessionID, status, userTimeout, fileSizeContained) values (?, ?, ?, ?);",
      [newSessionId, 1, 0, 0],
    );
    if (results.length == 0) {
      throw new Error("Unable to insert a new session");
    }
    return newSessionId;
  }
  async getUserSession(sessionID: string): Promise<boolean> {
    const results = await this.db.exec(
      `select * from user where sessionID = ?;`,
      sessionID,
    );
    console.log("Existing user with id", results[0].sessionID);
    return results.length != 0;
  }
  async updateUserSession(
    sid: string,
    updates: {
      sessionID?: string;
      status?: 0 | 1;
      userTimeout?: number;
      fileSizeContained?: number;
    },
  ) {
    console.log(
      `update user set ${this.compoundUpdates(updates)} where sessionID = ${sid}`,
    );
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

  async insert(file: Buffer, sid: string) {
    const results = await this.db.exec(
      "insert into file (expiration, ownerID, fileBuffer) values (? ? ?);",
      [0, sid, file],
    );
    if (results.length == 0) {
      throw new Error("Unable to insert a new file for user: " + sid);
    }
    console.log("Successfully inserted new file for user: ", sid);
  }
  async get(file: any, user: string) {}
  async delete(file: any, user: string) {
    this.db.exec(`DELETE FROM FILES WHERE f.id = ${file.id}`);
  }
  async clearRelatedItems() {}
}
