import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';

class DayNightCycleScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'time_advance'
    );
    this.time = 0;
  }

  init(parent,rootEntity){
    EventMan.publish({eventType: 'cycle_morning', parameters: {cycleNumber: this.dayNumber()}});
  }

  update(parent, rootEntity, delta) {
    parent.getChildAt(1).text = this.time;
  }

  dayNumber() {
    return Math.floor(this.time / 24) + 1;
  }

  handleGameEvent(parent, evt) {
    log.debug('event received + ' + evt.eventType);
    if (evt.eventType === 'time_advance') {
      let oldTime = this.time;
      this.time += 1;
      if (this.time % 24 === 0) {
        EventMan.publish({eventType: 'cycle_morning', parameters: {cycleNumber: this.dayNumber()}});
      }
    }
  }
}

export {DayNightCycleScript};
