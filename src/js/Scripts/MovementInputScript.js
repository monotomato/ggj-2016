import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';

class MovementInputScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'enable_player',
      'disable_player'
    );
    this.enabled = true;
  }

  update(parent, rootEntity, delta) {
    let movement = 0;
    parent.entered = false;
    if (this.enabled) {
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
      if (movement === 0) {
        parent.animation = parent.idle;
      } else {
        parent.animation = parent.walk;
      }
      parent.physics.body.vel.x = movement;
    } else {
      parent.animation = parent.idle;
      parent.physics.body.vel.x = 0;
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'disable_player') {
      this.enabled = false;
    } else if (evt.eventType === 'enable_player') {
      this.enabled = true;
    }
  }
}

export {MovementInputScript};
