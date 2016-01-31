import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';

class DarkenScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'time_change'
    );
  }

  init(parent, rootEntity) {
  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'time_change') {
      let t = evt.parameters.time;
      parent.sprite.alpha = (Math.abs(t - 12) / 12.0);
    }
  }
}

export {DarkenScript};
