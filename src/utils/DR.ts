import { DB } from "database/database";

class DependencyRegistrar {
  services: Map<string, object>;
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

  registerService(name: string, dep: object) {
    this.services.set(name, dep);
  }

  getService(name: string): object {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Dependency ${name} does not exist`);
    }
    return service;
  }
}

const DepRegistrar = new DependencyRegistrar();

// register services
const db = new DB();
DepRegistrar.registerService("Database", db);

export default DepRegistrar;
