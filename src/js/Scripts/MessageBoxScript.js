import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';
import {Factory} from 'Factory';
import {Collision} from 'Collision';

class MessageBoxScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes = ['notification'];
    this.text = 'Welcome to the village';
    this.bubble = Factory.createSpeechBubble(15, 2, 1, this.text, 'Latest news', false, false, 10);
    this.timer = 0;
    this.bubble.visible = false;
  }

  init(parent, rootEntity) {
    this.world = rootEntity.findEntityWithTag('world');
    parent.addChild(this.bubble);
    console.log(parent.position);
    // EventMan.publish({eventType: 'notification', parameters: {text:'Welcome to the Ovisburg!'}});
  }

  update(parent, rootEntity, delta) {
    if(this.bubble.visible){
      if(this.timer > 5000){
        this.bubble.visible = false;
        this.timer = 0;
      } else {
        this.timer += delta;
      }
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'notification') {
      console.log(evt);
      this.bubble.visible = true;

      this.text = evt.parameters.text;
      this.timer = 0;
      this.bubble.setText(this.text);
    }
  }
}

export {MessageBoxScript};
