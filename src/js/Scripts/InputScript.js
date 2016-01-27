import {log} from "Log";
import {Script} from "Script";
import {InputMan as Input} from "Managers/InputManager";
import {EventMan} from "Managers/EventManager";

class InputScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      "input_test"
    );
  }
  update(parent, rootEntity, delta) {
    if (Input.keyDown.up) {
      parent.position.y -= 1;
      EventMan.publish({
        eventType: "input_test",
        parameters: {
          message:"MOVING UP!"
        }
      });
    }
    if (Input.keyDown.down) {
      parent.position.y += 1;
    }
    if (Input.keyDown.left) {
      parent.position.x -= 1;
    }
    if (Input.keyDown.right) {
      parent.position.x += 1;
    }
  }
  handleGameEvent(parent, evt) {
    log.debug(evt.parameters.message);
  }
}

export {InputScript};
