import {log} from 'Log';

class System {
  constructor() {}

  updateEntities(entity, rootEntity, delta) {
    entity.children.forEach((child) => {
      this.updateEntities(child, rootEntity, delta);
    });
    this.applySystem(entity, rootEntity, delta);
  }

  applySystem(entity, rootEntity, delta) {
    log.warn('System apply not defined');
  }

  updateSystem(rootEntity, delta) {}

  update(rootEntity, delta) {
    this.updateSystem(rootEntity, delta);
    this.updateEntities(rootEntity, rootEntity, delta);
  }

}


export {System};
