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
  async exec(
    stmt: string,
    values?: any | Array<any>,
  ): Promise<any | undefined> {
    try {
      const results = await this.session.query(stmt, values);
      console.log(results[0]);
      console.log(results[1]);
      if (results === undefined) {
        throw new Error("");
      }
      return results[0];
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
    await this.db.exec(
      "INSERT into user (sessionID, status, userTimeout, fileSizeContained) values (?, ?, ?, ?);",
      [newSessionId, 0, 0, 0],
    );
    return newSessionId;
  }
  async checkUserExists(sessionID: string): Promise<boolean> {
    const result = await this.db.exec(
      `select * from user where sessionID = ?;`,
      sessionID,
    );
    console.log(result);
    return result.length != 0;
  }
  async updateUserSession() {}
  async deleteUserSession(user: string) {
    this.db.exec(`DELETE users FILES WHERE f.id = ${user}`);
  }
}

export class Files {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  async insert(file: any, user: string) {
    this.db.session.query("");
  }
  async get(file: any, user: string) {}
  async delete(file: any, user: string) {
    this.db.exec(`DELETE FROM FILES WHERE f.id = ${file.id}`);
  }
  async clearRelatedItems() {}
}
