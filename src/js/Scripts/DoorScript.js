import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {Collision} from 'Collision.js';

class DoorScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'enter_player'
    );
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntityWithTag('player');
    this.target = rootEntity.findEntityWithName(parent.target);
  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'enter_player') {
      if (Collision.aabbTestFast(this.player.physics.body, parent.physics.body) && !this.player.entered) {
        this.player.physics.body.pos.x = this.target.physics.body.pos.x;
        this.player.physics.body.pos.y = this.target.physics.body.pos.y;
        this.player.entered = true;
      }
    }
  }
}

export {DoorScript};
