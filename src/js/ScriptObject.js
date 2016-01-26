import {Scripts} from 'Scripts/Scripts.js';

class ScriptObject {
  constructor(parameters, funcName) {
    this.parameters = parameters;
    this.func = Scripts[funcName];
  }

  run(parent, entities, delta) {
    return this.func(parameters, parent, entities, delta);
  }
}

export {ScriptObject};
