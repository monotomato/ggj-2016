import {log} from "Log";

class System {

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
