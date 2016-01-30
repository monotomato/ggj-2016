import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {resources} from 'Managers/ResourceManager';
import {rand} from 'Utils/NumUtil';
import {Entity} from 'Entity';
import {Collision} from 'Collision.js';

class HouseControllerScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'cycle_morning'
    );
  }

  init(parent, rootEntity) {
    this.village = rootEntity.findEntityWithTag('village');
    this.village.houses = this.village.houses || rootEntity.findEntitiesWithTag('location_house');
    this.village.items = this.village.items || rootEntity.findEntitiesWithTag('item');
  }

  mapItemsToHouses() {
    let map = {};
    this.village.houses.forEach(house => {
      map[house.name] = [];
      this.village.items.forEach(item => {
        if (Collision.aabbTestFast(house.physics.body, item.physics.body)) {
          map[house.name].push(item);
        }
      });
    });
    this.village.houseItemMap = map;
  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'cycle_morning') {
      this.mapItemsToHouses();
      EventMan.publish({eventType: 'rank_apply_start', parameters: {}});
    }
  }
}

export {HouseControllerScript};
