import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {Collision} from 'Collision.js';

class DoorScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'enter_player',
      'teleport_player'
    );
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntityWithTag('player');
    this.target = rootEntity.findEntityWithName(parent.target);
  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'teleport_player') {
      let p = evt.parameters;
      if (p.sender == this) {
        this.player.physics.body.pos.x = this.target.physics.body.pos.x;
        this.player.physics.body.pos.y = this.target.physics.body.pos.y;
      }
    }
    if (evt.eventType === 'enter_player') {
      if (Collision.aabbTestFast(this.player.physics.body, parent.physics.body) && !this.player.entered) {
        // this.player.physics.body.pos.x = this.target.physics.body.pos.x;
        // this.player.physics.body.pos.y = this.target.physics.body.pos.y;
        this.player.entered = true;
        EventMan.publish({
          eventType: 'timed',
          parameters: {
            evt: {
              eventType: 'time_advance',
              parameters: {}
            },
            time: 0.5
          }
        });
        EventMan.publish({
          eventType: 'timed',
          parameters: {
            evt: {
              eventType: 'fade_in',
              parameters: {
                duration: 0.5
              }
            },
            time: 0.5
          }
        });
        EventMan.publish({
          eventType: 'timed',
          parameters: {
            evt: {
              eventType: 'teleport_player',
              parameters: {
                sender: this
              }
            },
            time: 0.5
          }
        });
        // EventMan.publish({eventType: 'time_advance', parameters: {}});
        EventMan.publish({eventType: 'fade_out', parameters: {
          duration: 0.5
        }});
      }
    }
  }
}

export {DoorScript};
