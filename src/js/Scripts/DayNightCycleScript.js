import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {resources} from 'Managers/ResourceManager';

class DayNightCycleScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'time_advance'
    );
    this.time = 0;
  }

  init(parent,rootEntity){
    // EventMan.publish({eventType: 'cycle_morning', parameters: {cycleNumber: this.dayNumber()}});
    this.village = rootEntity.findEntityWithTag('village');
    this.schelude = resources.npcSchelude.data.schelude;
    this.rootEntity = rootEntity;
  }

  update(parent, rootEntity, delta) {
    parent.getChildAt(1).text = this.dayTime();
    if (!this.firstUpdate) {
      this.firstUpdate = true;
      this.time = 11;
      this.advanceTime();
    }
  }

  dayNumber() {
    return Math.floor(this.time / 24) + 1;
  }

  dayTime() {
    return this.time % 24;
  }

  advanceTime() {
    let oldTime = this.time;
    this.time += 1;
    EventMan.publish({eventType: 'time_change', parameters: {time: this.dayTime()}});
    this.updateNpcs();
    if (this.dayTime() === 0) {
      EventMan.publish({eventType: 'cycle_morning', parameters: {cycleNumber: this.dayNumber()}});
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'time_advance') {
      this.advanceTime();
    }
  }

  updateNpcs() {
    let schel = this.schelude[this.dayTime()];
    this.village.npcs.forEach(villager => {
      let location = schel[villager.id];
      let spawn;
      if (location == 'home') {
        let house = villager.house;
        if (house) {
          let houseId = villager.house.houseId;
          spawn = this.rootEntity.findEntityWithName('house_spawn_' + houseId);
        }
      } else {
        let last = location[location.length - 1];
        let spawnId = '1';
        if (last == 'a') {
          spawnId = '2';
          last = location[location.length - 2];
        }
        let convId = last;
        spawn = this.rootEntity.findEntityWithName('location_conversation_' + convId + '_spawn_' + spawnId);
      }
      if (spawn) {
        villager.location = location;
        villager.physics.body.pos.x = spawn.physics.body.pos.x;
        villager.physics.body.pos.y = spawn.physics.body.pos.y;
      }
    });
  }
}

export {DayNightCycleScript};
