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
    //log.debug(this.villager.love.name)
  }
}

export {HouseScript};
