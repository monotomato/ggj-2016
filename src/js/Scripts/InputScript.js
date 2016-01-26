import {log} from "Log";

var InputScript = {
  update: (parameters, parent, entities, delta) => {
    log.debug("bar");
  },
  handleEvent: (parent, evt) => {},
  eventTypes: ["collision_player"]
};


export {InputScript as InputScript};
