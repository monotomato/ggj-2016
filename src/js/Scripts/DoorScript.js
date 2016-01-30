import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {Collision} from 'Collision.js';

class DoorScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'player'
    );
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntitiesWithTag('player');
    this.target = rootEntity.findEntityWithTag(parent.target);
  }

  randomizeIngredients() {

  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {
    log.debug(evt);
    if (evt.eventType === 'player_interact') {
      if (Collision.aabbTestFast(this.player.physics.body, parent.physics.body)) {
        
        this.player.physics.body.x = this.target.position.x;
        this.player.physics.body.y = this.target.position.y;
      }
    }
  }
}

export {DoorScript};
