import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {Collision} from 'Collision';

class HouseScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'item_thrown'
    );
  }

  init(parent, rootEntity) {
    this.parent = parent;
    this.village = rootEntity.findEntityWithTag('village');
  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'item_thrown') {
      if (Collision.aabbTestFast(this.parent.physics.body, evt.parameters.item.physics.body)) {
        this.checkItemAgainstVillagerNeeds(evt.parameters.item);
      }
    }
  }

  checkItemAgainstVillagerNeeds(item) {
    let disappear;
    log.debug(this.parent.villager.love.name + ' ' + this.parent.villager.hate.name);
    if (item === this.parent.villager.love) {
      EventMan.publish({eventType: 'rank_change', parameters: {villagerName: this.village.player.name, rankChange: -1.1}});
      disappear = true;
    } else if (item === this.parent.villager.hate) {
      EventMan.publish({eventType: 'rank_change', parameters: {villagerName: this.parent.villager.name, rankChange: 1.1}});
      disappear = true;
    }
    if (disappear) {
      item.physics.body.pos.x = 15000;
    }
  }
}

export {HouseScript};
