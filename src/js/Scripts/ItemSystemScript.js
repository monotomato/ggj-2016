import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
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
      //TODO set item to loc position
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
