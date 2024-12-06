import { Database } from "database/database";

class DependencyRegistrar {
  services: Map<string, any>;
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

  registerService(name: string, dep: any) {
    this.services.set(name, dep);
  }

  getService(name: string): any {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Dependency ${name} does not exist`);
    }
    return service;
  }
}

const DepRegistrar = new DependencyRegistrar();

export default DepRegistrar;
