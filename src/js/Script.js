import {log} from "Log";

class Script {
  constructor(parameters) {
    Object.assign(this, parameters);
    this.eventTypes = [];
  }

  init(rootEntity) {}

  update(parameters, parent, rootEntity, delta) {}

  handleGameEvent(parent, evt) {
    log.debug("This shouldn't print");
  }
}

export {Script};
