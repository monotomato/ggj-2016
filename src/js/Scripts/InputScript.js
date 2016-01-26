import {log} from "Log";
import {Script} from "Script";
import {Input} from "Input";
import {EventManager} from "EventManager";

class InputScript extends Script {
  update(parent, rootEntity, delta) {
    if (Input.keyPressed.up) {
      log.debug("up");
      EventManager.publish({
        eventType: "foo_bar_baz",
        parameters: {
          "junk":100
        }
      });
    }
  }
  handleGameEvent(parent, evt) {
    log.debug("mmm");
    log.debug(evt);
  }
}

export {InputScript};
