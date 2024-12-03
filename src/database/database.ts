interface Database {
  insert(file: any, user: string): void;
  get(file: any, user: string): void;
  delete(file: any, user: string): void;
  connect(): void;
}

export class DB implements Database {
  constructor() {}
  async connect() {}
  async insert(file: any, user: string) {}
  async get(file: any, user: string) {}
  async delete(file: any, user: string) {}
}
