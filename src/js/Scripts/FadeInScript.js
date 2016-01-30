import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';

class FadeInScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'fade_in',
      'fade_out'
    );
    this.fade_in = false;
    this.fade_out = false;
  }

  init(parent, rootEntity) {
  }

  update(parent, rootEntity, delta) {
    if (this.fade_in) {
      parent.alpha -= 0.01;
      if (parent.alpha < 0.0) {
        parent.alpha = 0.0;
        this.fade_in = false;
      }
    } else if (this.fade_out) {
      parent.alpha += 0.01;
      if (parent.alpha > 1.0) {
        parent.alpha = 1.0;
        this.fade_out = false;
      }
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'fade_in') {
      this.fade_in = true;
    } else if (evt.eventType === 'fade_out') {
      this.fade_out = true;
    }
  }
}

export {FadeInScript};
