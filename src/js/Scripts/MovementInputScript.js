import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';

class MovementInputScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'input_test'
    );
  }
  update(parent, rootEntity, delta) {
    let movement = 0;
    if (Input.keyDown.left) {
      movement -= this.movementSpeed;
    }
    if (Input.keyDown.right) {
      movement += this.movementSpeed;
    }
    if (Input.keyPressed.interact) {
      EventMan.publish({
        eventType:' interact_player',
        parameters: {}
      });
    }
    if (Input.keyPressed.up) {
      EventMan.publish({eventType: 'player_interact', parameters: {}});
    }
    parent.physics.body.vel.x = movement;
  }

  handleGameEvent(parent, evt) {
    log.debug(evt.parameters.message);
  }
}

export {MovementInputScript};
