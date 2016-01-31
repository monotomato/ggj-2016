import {log} from 'Log';
import {Script} from 'Script';
import {InputMan as Input} from 'Managers/InputManager';
import {EventMan} from 'Managers/EventManager';

class AnimationScript extends Script {
  constructor(parameters) {
    super(parameters);
    // this.eventTypes.push(
    //   'animation_test'
    // );
    this.currentFrame = 0;
  }

  init(parent, rootEntity) {
    parent.timeAtCurrentFrame = -1;
  }

  update(parent, rootEntity, delta) {
    const anim = parent.animation;

    if(anim){
      const frames = anim.anim;

      if (frames.length <= this.currentFrame) {
        this.currentFrame = frames.length - 1;
      }

      if(parent.timeAtCurrentFrame > frames[this.currentFrame].duration || parent.timeAtCurrentFrame === -1){
        // Change current frame
        const newFrame = (this.currentFrame + 1) % frames.length;
        this.currentFrame = newFrame;
        parent.setSprite(frames[this.currentFrame].frame);
        parent.timeAtCurrentFrame = 0;
      } else {
        parent.timeAtCurrentFrame += delta;
      }
    } else{
      log.warn('Animation script needs animation component to work');
    }
  }

  handleGameEvent(parent, evt) {

  }
}

export {AnimationScript};
