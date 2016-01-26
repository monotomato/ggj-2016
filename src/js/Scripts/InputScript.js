import {log} from "Log";
import {Script} from "Script";

class InputScript extends Script {
  update(parent, rootEntity, delta) {
    log.debug("bar");
  }
  handleGameEvent(parent, evt) {
    log.debug("mmm");
  }
}

export {InputScript};
