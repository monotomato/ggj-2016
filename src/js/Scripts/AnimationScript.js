import {log} from "Log";
import {Script} from "Script";
import {InputMan as Input} from "Managers/InputManager";
import {EventMan} from "Managers/EventManager";

class AnimationScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      "animation_test"
    );
    this.timeAtCurrentFrame = -1;
    this.currentFrame = 0;
  }

  init(rootEntity) {
    log.debug("anim script init");
  }

  update(parent, rootEntity, delta) {
    const anim = parent.animation;

    if(anim){
      const frames = anim.anim;

      if(this.timeAtCurrentFrame > frames[this.currentFrame].duration || this.timeAtCurrentFrame === -1){
        // Change current frame
        const newFrame = (this.currentFrame + 1) % frames.length;
        this.currentFrame = newFrame;
        parent.setSprite(frames[this.currentFrame].frame);
        this.timeAtCurrentFrame = 0;
      } else {
        this.timeAtCurrentFrame += delta;
      }
    } else{
      log.warn("Animation script needs animation component to work");
    }
  }

  handleGameEvent(parent, evt) {
    log.debug("Anim script: " + evt.parameters.message);
  }
}

export {AnimationScript};
