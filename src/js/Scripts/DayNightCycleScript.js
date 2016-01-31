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
  }

  dayNumber() {
    return Math.floor(this.time / 24) + 1;
  }

  dayTime() {
    return this.time % 24;
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'time_advance') {
      let oldTime = this.time;
      this.time += 1;
      this.updateNpcs();
      if (this.dayTime() === 0) {
        EventMan.publish({eventType: 'cycle_morning', parameters: {cycleNumber: this.dayNumber()}});
      }
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
        let convId = location[location.length - 1];
        //TODO set to random free spawn in converstation
        spawn = this.rootEntity.findEntityWithName('location_conversation_' + convId + '_spawn_1');
      }
      if (spawn) {
        villager.physics.body.pos.x = spawn.physics.body.pos.x;
        villager.physics.body.pos.y = spawn.physics.body.pos.y;
      }
    });
  }
}

export {DayNightCycleScript};
