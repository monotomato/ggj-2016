import {log} from "Log";

class System {
  constructor() {
    if (new.target === System) {
      throw new TypeError("Cannot construct System instance directly");
    }
  }
  update(rootEntity, delta) {
    rootEntity.children.forEach((entity) => {
      this.update(entity.children);
      applySystem(entity, rootEntity, delta);
    });
  }

  applySystem(entity, rootEntity, delta) {
    log.warn("System apply not defined");
  }
}


export {System};
