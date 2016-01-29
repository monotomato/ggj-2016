import {System} from 'System';
import {log} from 'Log';

class ScriptSystem extends System {
  applySystem(entity, rootEntity, delta) {
    if (entity.scripts) {
      entity.scripts.forEach((scriptObj) => {
        scriptObj.update(entity, rootEntity, delta);
      });
    }
  }
}

export {ScriptSystem};
