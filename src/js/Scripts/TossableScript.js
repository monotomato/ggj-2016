import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {Collision} from 'Collision';

class TossableScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'interact_player'
    );
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntitiesWithTag('player')[0];
  }

  update(parent, rootEntity, delta) {

  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'interact_player') {
      if (Collision.checkCollisionFast(parent.physics.body, player.physics.body)) {
        log.debug("Picked up!");
      }
    }
    log.debug(evt.parameters.message);
  }
}

export {TossableScript};
