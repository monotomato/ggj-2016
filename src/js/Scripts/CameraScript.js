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
    log.debug('CameraInit');
    this.player = rootEntity.findEntityWithTag('player');
    log.debug(this.player);
  }

  update(parent, rootEntity, delta) {
    // TODO: Camera handling
    parent.position.x = -this.player.position.x + cfg.renderer.size.x/2;
    parent.position.y = -this.player.position.y + cfg.renderer.size.y/2;
    // if (Input.keyDown.left) {
    //   parent.position.x += 5.0;
    // }
    // if (Input.keyDown.right) {
    //   parent.position.x -= 5.0;
    // }
    // if (Input.keyDown.up) {
    //   parent.position.y += 5.0;
    // }
    // if (Input.keyDown.down) {
    //   parent.position.y -= 5.0;
    // }
  }

  handleGameEvent(parent, evt) {
    log.debug('camera script: ' + evt.parameters.message);
  }
}

export {CameraScript};