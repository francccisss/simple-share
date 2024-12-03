interface Database {
  insert(file: any, user: string);
  get(file: any, user: string);
  delete(file: any, user: string);
  connect();
}

export class MockDB implements Database {
  constructor() {}
  async connect() {}
  async insert(file: any, user: string) {}
  async get(file: any, user: string) {}
  async delete(file: any, user: string) {}
}
