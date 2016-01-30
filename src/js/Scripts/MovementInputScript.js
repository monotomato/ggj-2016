import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';

class MovementInputScript extends Script {
  constructor(parameters) {
    super(parameters);
  }

  update(parent, rootEntity, delta) {
    let movement = 0;
    parent.entered = false;
    if (Input.keyDown.left) {
      movement -= this.movementSpeed;
      parent.sprite.scale.x = -1;
      parent.facingRight = false;
    }
    if (Input.keyDown.right) {
      movement += this.movementSpeed;
      parent.sprite.scale.x = +1;
      parent.facingRight = true;
    }
    if (Input.keyPressed.interact) {
      EventMan.publish({
        eventType: 'interact_player',
        parameters: {}
      });
    }
    if (Input.keyPressed.up) {
      EventMan.publish({eventType: 'enter_player', parameters: {}});
    }
    parent.physics.body.vel.x = movement;
  }

  handleGameEvent(parent, evt) {
    log.debug(evt.parameters.message);
  }
}

export {MovementInputScript};
