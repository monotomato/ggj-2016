import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';
import {Factory} from 'Factory';

class InitiateConversationScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.converse = false;
    this.text = 'This is placeholder text. Change it with events.';
    this.bubble = Factory.createSpeechBubble(11, 3, 6, this.text);
  }

  init(parent, rootEntity) {
    this.player = rootEntity.findEntityWithTag('player');
    parent.addChild(this.bubble);
    this.bubble.visible = false;
  }

  update(parent, rootEntity, delta) {
    if (this.converse) {
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
    } else if (evt.eventType === 'start_conversation') {
      if (evt.parameters.target == this) {
        this.converse = false;
      }
    } else if (evt.eventType === 'end_conversation') {
      if (evt.parameters.target == this) {
        this.converse = true;
      }
    }
  }
}

export {InitiateConversationScript};
