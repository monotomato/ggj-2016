import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';

class CameraScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'camera',
      'disable_camera',
      'enable_camera'
    );
    this.enabled = true;
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntityWithTag('player');
  }

  update(parent, rootEntity, delta) {
    if (this.player.position.y > 800) {
      EventMan.publish({eventType: 'disable_camera', parameters: {}});
    } else {
      EventMan.publish({eventType: 'enable_camera', parameters: {}});
    }
    if (this.enabled) {
      parent.position.x = -this.player.position.x + cfg.renderer.size.x/2;
      if (this.player.position.x < cfg.renderer.size.x / 2) parent.position.x = 0;
      if (this.player.position.y < 800 && this.player.position.x > 2430) parent.position.x = cfg.renderer.size.x/2 - 2430;
      if (this.player.position.y < 800) {
        parent.position.y = -220;
      } else {
        parent.position.y = -this.player.position.y + cfg.renderer.size.y/2 + 100;
      }
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'disable_camera') {
      this.enabled = false;
    } else {
      this.enabled = true;
    }
  }
}

export {CameraScript};
