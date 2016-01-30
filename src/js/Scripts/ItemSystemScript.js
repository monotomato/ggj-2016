import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {rand} from 'Utils/NumUtils';
import {resources} from 'Managers/ResourceManager';
import {Entity} from 'Entity';

class ItemSystemScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'cycle_morning'
    );
  }

  init(parent,rootEntity) {
    this.village = rootEntity.findEntityWithTag('village');
    Object.keys(resources).forEach(key => {
      if (key.indexOf('entity_item') === 0) {
        let ent = Entity.fromConfig(key);
        this.village.addChild(ent);
      }
    });
    this.items = rootEntity.findEntitiesWithTag('item');
    this.itemLocations = rootEntity.findEntitiesWithTag('location_item');
    this.relocateItems();
  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {
  }

  relocateItems() {
    if (this.itemLocations.length < this.items.length) {
      log.error('There should be more locations than items on map!');
      return;
    }
    this.itemLocations.forEach(loc => {
      loc.inUse = false;
    });
    this.items.forEach(item => {
      let loc;
      do {
        loc = this.itemLocations[rand(this.itemLocations.length)];
      } while (loc.inUse);
      loc.inUse = true;
      //TODO set item to loc position
    });
  }
}

export {ItemSystemScript};
