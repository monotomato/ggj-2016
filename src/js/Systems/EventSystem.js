import {System} from "System";
import {log} from "Log";

class EventSystem extends System {
  applySystem(entity, rootEntity, delta) {
    if (entity.handleEvents) {
      entity.handleEvents();
    }
  }
}

export {EventSystem};
