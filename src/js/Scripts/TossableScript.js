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
      parent.position.y = this.player.position.y - 30;
    }

  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'interact_player') {
      if (this.picked) {
        parent.physics.body.awake = true;
        parent.physics.body.pos.x = parent.position.x;
        parent.physics.body.pos.y = parent.position.y;
        parent.physics.body.vel.x = 0.2;
        parent.physics.body.vel.y = -0.2;
        // parent.addPhysics('rectangle', {
        //   pos: {
        //     x: parent.position.x,
        //     y: parent.position.y
        //   },
        //   vel: {
        //     y: -0.01,
        //     x: 0
        //   }
        // });
        console.log(parent.physics);
        this.picked = false;
      } else if (Collision.aabbTestFast(parent.physics.body, this.player.physics.body)) {
        this.picked = true;
      }
    }
    log.debug(evt.parameters.message);
  }
}

export {TossableScript};
