export class Database {
  constructor() {}

  async connect() {}

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
}

export class Users {
  db: Database;
  constructor(db: Database) {
    this.db = db;
  }
  async insertUserSession() {}
  async deleteUserSession(user: string) {
    this.db.exec(`DELETE users FILES WHERE f.id = ${user}`);
  }
  async clearUserItems() {}
}
