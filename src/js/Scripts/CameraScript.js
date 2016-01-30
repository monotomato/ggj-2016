import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';

class CameraScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'camera'
    );
  }

  init(parent, rootEntity) {
    log.debug('CameraInit');
    this.player = rootEntity.findEntityWithTag('player');
    log.debug(this.player);
  }

  update(parent, rootEntity, delta) {
    // TODO: Camera handling
  }

  handleGameEvent(parent, evt) {
    log.debug('camera script: ' + evt.parameters.message);
  }
}

export {CameraScript};
