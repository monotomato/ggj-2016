import {log} from "Log";

class System {
  constructor() {}

  update(entity, rootEntity, delta) {
    entity.children.forEach((child) => {
      this.update(child, rootEntity, delta);
    });
    this.applySystem(entity, rootEntity, delta);
  }

  applySystem(entity, rootEntity, delta) {
    log.warn("System apply not defined");
  }
}


export {System};
