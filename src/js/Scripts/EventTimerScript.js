import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';

class EventTimerScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'timed'
    );
    this.events = [];
  }

  init(parent, rootEntity) {
  }

  update(parent, rootEntity, delta) {
    this.events.forEach((evtOb) => {
      let evt = evtOb.event;
      evtOb.timer += delta / 1000.0;
      // log.debug(evtOb.timer);
      // log.debug(evt.parameters.time);
      if (evtOb.timer > evt.parameters.time) {
        log.debug("Uh-huh");
        EventMan.publish(evt.parameters.evt);
      }
    });
    this.events = this.events.filter((evtOb) => {
      return evtOb.timer < evtOb.event.parameters.time;
    });
  }

  handleGameEvent(parent, evt) {
    log.debug("Handlin'");
    if (evt.eventType === 'timed') {
      this.events.push({event: evt, timer: 0.0});
    }
  }
}

export {EventTimerScript};
