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
    this.converse = false;
    this.text = 'This is placeholder text. Change it with events.';
    this.bubble = Factory.createSpeechBubble(11, 3, 6, this.text);
  }

  init(parent, rootEntity) {
    log.debug("init bb");
    this.player = rootEntity.findEntityWithTag('player');
    parent.addChild(this.bubble);
    this.bubble.visible = false;
  }

  update(parent, rootEntity, delta) {
    let playerCollide = Collision.aabbTestFast(parent.physics.body, this.player.physics.body);
    if (playerCollide) {
      this.bubble.visible = true;
    } else {
      this.bubble.visible = false;
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'change_text') {
      if (evt.parameters.target == this) {
        this.text = evt.parameters.text;
        this.bubble.setText(this.text);
      }
    }
  }
}

export {BulletinBoardScript};