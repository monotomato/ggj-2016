import {log} from "Log";

class System {
  constructor() {
    if (new.target === System) {
      throw new TypeError("Cannot construct System instance directly");
    }
  }
  update(entities, delta) {
    entities.forEach((entity) => {
      this.update(entity.children);
      applySystem(entity, delta);
    });
  }

  applySystem(entity, delta) {
    log.warn("System apply not defined");
  }
}
