import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';
import {Factory} from 'Factory';
import {Collision} from 'Collision';

class BulletinBoardScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push('change_text');
    this.converse = false;
    this.text = 'This is placeholder text. Change it with events.';
    this.bubble = Factory.createSpeechBubble(11, 6, 6, this.text);
    this.bubble.position.y -= 40;
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntityWithTag('player');
    parent.addChild(this.bubble);
    this.bubble.visible = false;
  }

  update(parent, rootEntity, delta) {
    let playerCollide = Collision.aabbTestFast(parent.physics.body, this.player.physics.body);
    if (playerCollide) {
      this.bubble.visible = true;
    } else {
      // EventMan.publish({eventType: 'audio_sound_play', parameters: {audio:'audio_door_2'}});
      this.bubble.visible = false;
    }
  }

  handleGameEvent(parent, evt) {

    if (evt.eventType === 'change_text') {
      if (evt.parameters.target.name == parent.name) {
        this.text = evt.parameters.text;
        this.bubble.setText(this.text);
      }
    }
  }
}

export {BulletinBoardScript};
