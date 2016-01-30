import {log} from 'Log';

class Script {
  constructor(parameters) {
    let a = {};
    jQuery.extend(true, a, parameters);
    Object.assign(this, a);

    // Object.keys().forEach(key => {
    //   let a = {};
    //   jQuery
    //   this[key] =
    // });
    this.eventTypes = [];
  }

  init(parent, rootEntity) {}

  update(parameters, parent, rootEntity, delta) {}
  lateUpdate(parameters, parent, rootEntity, delta) {}

  handleGameEvent(parent, evt) {}
}

export {Script};
