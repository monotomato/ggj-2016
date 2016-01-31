import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';
import {populateTemplate} from 'Utils/StringUtil';
import {resources} from 'Managers/ResourceManager';
import {Factory} from 'Factory';
import {rand} from 'Utils/NumUtil';

class InitiateConversationScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.converse = false;
    this.eventTypes.push(
      'cycle_morning'
    );
    this.text = 'Blaablaablaablaa.';
  }

  init(parent, rootEntity) {
    this.bubble = Factory.createSpeechBubble(11, 3, 6, this.text, parent.name);
    this.parent = parent;
    this.player = rootEntity.findEntityWithTag('player');
    this.conversations = resources.conversations.data;
    parent.addChild(this.bubble);
    this.bubble.visible = false;
    this.randomize();
  }

  update(parent, rootEntity, delta) {
    if (Math.abs(this.player.physics.body.pos.x - parent.physics.body.pos.x) < 50) {
      this.converse = true;
    } else {
      this.converse = false;
    }
    if (this.converse) {
      this.bubble.visible = true;
    } else {
      this.bubble.visible = false;
    }
  }

  randomize() {
    let text;
    let r = rand(3);
    if (r === 0) {
      text = this.conversations.hate[rand(this.conversations.hate.length)];
    } else if (r === 1) {
      text = this.conversations.love[rand(this.conversations.love.length)];
    } else {
      text = this.conversations.replies[rand(this.conversations.replies.length)];
    }
    let obj = {love: this.parent.love.name.slice(5), hate: this.parent.hate.name.slice(5)};
    this.text = populateTemplate(text, obj);
    this.bubble.setText(this.text);
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'cycle_morning') {
      this.randomize();
    }
  }
}

export {InitiateConversationScript};
