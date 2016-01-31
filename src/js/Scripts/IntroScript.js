import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';
import cfg from 'config.json';
import {Factory} from 'Factory';
import {Collision} from 'Collision';

class IntroScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes = ['intro'];
    this.text = 'The town of Ovisbury has fallen out of favor with their god! Once every two days, the lowest-ranking member of the society will be sacrificed unless the concerning issue is solved. Help the society or save yourself, the choice is yours. Good luck!';
    this.bubble = Factory.createSpeechBubble(21, 5, 10, this.text, 'Welcome', true, false, 60);
    this.timer = 0;
  }

  init(parent, rootEntity) {
    // this.world = rootEntity.findEntityWithTag('world');
    parent.addChild(this.bubble);
    // this.bubble.visible = true;
    // console.log(parent.position);
    // EventMan.publish({eventType: 'notification', parameters: {text:'Welcome to the Ovisburg!'}});
  }

  update(parent, rootEntity, delta) {
    if (this.timer < 5500) {
      this.timer += delta;
    } else {
      // this.bubble.visible = false;
      this.bubble.alpha -= 0.01;
    }
    // if(this.bubble.visible){
    //   if(this.timer > 5000){
    //     this.bubble.visible = false;
    //     this.timer = 0;
    //   } else {
    //     this.timer += delta;
    //   }
    // }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'intro') {
      EventMan.publish({
        eventType: 'disable_player',
        parameters: {}
      });
      EventMan.publish({
        eventType: 'timed',
        parameters: {
          evt: {
            eventType: 'fade_in',
            parameters: {
              duration: 2.0
            }
          },
          time: 4.0
        }
      });
      EventMan.publish({
        eventType: 'timed',
        parameters: {
          evt: {
            eventType: 'enable_player',
            parameters: {}
          },
          time: 6.0
        }
      });
    }
    // if (evt.eventType === 'notification') {
    //   console.log(evt);
    //   this.bubble.visible = true;
    //
    //   this.text = evt.parameters.text;
    //   this.bubble.setText(this.text);
    // }
  }
}

export {IntroScript};
