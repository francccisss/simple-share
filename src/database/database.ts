import { Connection } from "mysql2/promise";

import { exit } from "process";

export class Database {
  private session: Connection | null = null;
  constructor() {}

  async connect(sqlConn: Connection) {
    try {
      //await sqlConn.connect();
      this.session = sqlConn;
      // A simple SELECT query
      try {
        const [results, fields] = await this.session.query(
          "SELECT * FROM user WHERE status = 1;",
        );

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
      } catch (err) {
        console.log(err);
      }
      this.session.end();
    } catch (err) {
      const error = err as Error;
      console.error("Unable to connect to the mysql server");
      console.error("Exiting application");
      exit();
    }
  }
  async disconnect() {}

  // executes script
  async exec(script: string) {}
}

export class Files {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  async insert(file: any, user: string) {}
  async get(file: any, user: string) {}
  async delete(file: any, user: string) {
    this.db.exec(`DELETE FROM FILES WHERE f.id = ${file.id}`);
  }
  async clearRelatedItems() {}
}

export class Users {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
  async insertUserSession() {}
  async updateUserSession() {}
  async deleteUserSession(user: string) {
    this.db.exec(`DELETE users FILES WHERE f.id = ${user}`);
  }
}
