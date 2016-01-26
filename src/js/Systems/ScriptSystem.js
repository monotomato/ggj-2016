import System from "System";

class ScriptSystem extends System {
  applySystem(entity, rootEntity, delta) {
    entity.scripts.forEach((scriptObj) => {
      scriptObj.run(entity, rootEntity, delta);
    });
  }
}

export {ScriptSystem};
