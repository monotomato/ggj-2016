import {log} from 'Log';

class Script {
  constructor(parameters) {
    Object.assign(this, parameters);
    this.eventTypes = [];
  }

  // TODO: Script initialization.
  init(rootEntity) {}

  update(parameters, parent, rootEntity, delta) {}

  handleGameEvent(parent, evt) {}
}

export {Script};
