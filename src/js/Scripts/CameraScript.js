import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';

class CameraScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'camera'
    );
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntityWithTag('player');
  }

  update(parent, rootEntity, delta) {
    parent.position.x = -this.player.position.x + cfg.renderer.size.x/2;
    parent.position.y = -this.player.position.y + cfg.renderer.size.y/2;
  }

  handleGameEvent(parent, evt) {

  }
}

export {CameraScript};
