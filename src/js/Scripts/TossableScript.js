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
    this.picked = false;
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntitiesWithTag('player')[0];
  }

  update(parent, rootEntity, delta) {
    if (this.picked) {
      parent.physics.body.awake = false;
      parent.position.x = this.player.position.x;
      parent.position.y = this.player.position.y - 50;
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'interact_player') {
      if (this.picked) {
        let body = parent.physics.body;
        body.awake = true;
        body.pos.x = parent.position.x;
        body.pos.y = parent.position.y;
        if (this.player.facingRight) {
          body.vel.x = 0.5;
        } else {
          body.vel.x = -0.5;
        }
        parent.physics.body.vel.y = -0.5;
        this.picked = false;
      } else if (Collision.aabbTestFast(parent.physics.body, this.player.physics.body)) {
        this.picked = true;
      }
    }
    log.debug(evt.parameters.message);
  }
}

export {TossableScript};
