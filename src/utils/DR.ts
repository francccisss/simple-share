import { Database } from "database/database";

class DependencyRegistrar {
  services: Map<string, Database>;
  private static instance: DependencyRegistrar | null = null;

  constructor() {
    this.services = new Map();
  }

  getInstance(): DependencyRegistrar {
    if (DependencyRegistrar.instance == null) {
      DependencyRegistrar.instance = new DependencyRegistrar();
    }
    return DependencyRegistrar.instance;
  }

  registerService(name: string, dep: Database) {
    this.services.set(name, dep);
  }

  getService(name: string): Database {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Dependency ${name} does not exist`);
    }
    return service;
  }
}

const DepRegistrar = new DependencyRegistrar();

// register services
const db = new Database();
DepRegistrar.registerService("Database", db);

export default DepRegistrar;
