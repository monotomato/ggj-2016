import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {Game} from 'Game';
import {rand} from 'Utils/NumUtil';
import {resources} from 'Managers/ResourceManager';
import {Entity} from 'Entity';
import {populateTemplate} from 'Utils/StringUtil';

class ItemSystemScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'cycle_morning'
    );
  }

  init(parent,rootEntity) {
    this.village = rootEntity.findEntityWithTag('village');
    this.items = rootEntity.findEntitiesWithTag('item');
    this.itemLocations = rootEntity.findEntitiesWithTag('location_item');
    this.relocateItems(rootEntity);
  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {
  }

  relocateItems(rootEntity) {
    if (this.itemLocations.length < this.items.length) {
      log.error('There should be more locations than items on map!');
      return;
    }
    let typeNames = resources.itemTypes.data;
    this.itemLocations.forEach(loc => {
      loc.inUse = false;
    });
    this.village.itemTypes = [];
    this.items.forEach(item => {
      let loc;
      do {
        loc = this.itemLocations[rand(this.itemLocations.length)];
      } while (loc.inUse);
      loc.inUse = true;
      item.physics.body.pos.x = loc.physics.body.pos.x;
      item.physics.body.pos.y = loc.physics.body.pos.y;
      //Register all types of items
      item.tags.forEach(tag => {
        if (this.village.itemTypes.indexOf(tag) === -1 && typeNames[tag]) {
          this.village.itemTypes.push(typeNames[tag]);
        }
      });
    });
  }
}

export {ItemSystemScript};
