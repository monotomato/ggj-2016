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

  init(parent, rootEntity) {
    
  }

  update(parent, rootEntity, delta) {
    // let movement = 0;
    // if (Input.keyDown.left) {
    //   movement -= this.movementSpeed;
    // }
    // if (Input.keyDown.right) {
    //   movement += this.movementSpeed;
    // }
    // parent.physics.body.state.vel.x = movement;
    if (Input.keyDown.left) {
      parent.position.x += 5.0;
    }
    if (Input.keyDown.right) {
      parent.position.x -= 5.0;
    }
    if (Input.keyDown.up) {
      parent.position.y += 5.0;
    }
    if (Input.keyDown.down) {
      parent.position.y -= 5.0;
    }
  }

  handleGameEvent(parent, evt) {
    log.debug(evt.parameters.message);
  }
}

export {MovementInputScript};
