import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';

class DayNightCycleScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.time = 0;
  }

  init(parent,rootEntity){
    EventMan.publish({eventType: 'cycle_morning', parameters: {cycleNumber: this.cycleNumber(this.time)}});
  }

  update(parent, rootEntity, delta) {
    let oldTime = this.time;
    this.time += delta / 1000;
    if (this.dayTime(oldTime) > 0 && this.dayTime(this.time) === -1) {
      EventMan.publish({eventType: 'cycle_night', parameters: {cycleNumber: this.cycleNumber(this.time)}});
    } else if (this.nightTime(oldTime) > 0 && this.nightTime(this.time) === -1) {
      EventMan.publish({eventType: 'cycle_morning', parameters: {cycleNumber: this.cycleNumber(this.time)}});
    }
  }

  cycleNumber(ctime) {
    return Math.floor(ctime / (this.dayLength + this.nightLength));
  }

  dayTime(ctime) {
    let cycleLength = this.dayLength + this.nightLength;
    let currentCycleTime = ctime % cycleLength;
    if (currentCycleTime > this.dayLength) {
      return -1;
    }
    return currentCycleTime / this.dayLength;
  }

  nightTime(ctime) {
    let cycleLength = this.dayLength + this.nightLength;
    let currentCycleTime = ctime % cycleLength;
    if (currentCycleTime < this.dayLength) {
      return -1;
    }
    return (currentCycleTime - this.dayLength / this.nightLength);
  }

  handleGameEvent(parent, evt) {

  }
}

export {DayNightCycleScript};
