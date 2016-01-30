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
    // log.debug('movem script init');
    let ent = rootEntity.findEntitiesWithTag('test');
    console.log(ent);
  }

  update(parent, rootEntity, delta) {
    let movement = 0;
    if (Input.keyDown.left) {
      movement -= this.movementSpeed;
    }
    if (Input.keyDown.right) {
      movement += this.movementSpeed;
    }
    parent.physics.body.state.vel.x = movement;
  }

  handleGameEvent(parent, evt) {
    log.debug(evt.parameters.message);
  }
}

export {MovementInputScript};
