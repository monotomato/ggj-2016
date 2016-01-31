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
    this.village.items = this.village.items || this.items;
    this.itemLocations = rootEntity.findEntitiesWithTag('location_item');
    this.rootEntity = rootEntity;
    this.relocateItems(rootEntity);
  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'cycle_morning') {
      this.relocateItems(this.rootEntity);
    }
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
    this.village.rawTypesByName = {};
    this.items.forEach(item => {
      if (item.relocated) {
        let loc;
        item.relocated = false;
        do {
          loc = this.itemLocations[rand(this.itemLocations.length)];
        } while (loc.inUse);
        loc.inUse = true;
        item.physics.body.pos.x = loc.physics.body.pos.x;
        item.physics.body.pos.y = loc.physics.body.pos.y;
        item.physics.body.vel.x = 0;
        item.physics.body.vel.y = 0;
      }
      //Register all types of items
      item.tags.forEach(tag => {
        if (this.village.itemTypes.indexOf(tag) === -1 && typeNames[tag]) {
          this.village.itemTypes.push(typeNames[tag]);
          this.village.rawTypesByName[typeNames[tag]] = tag;
        }
      });
    });
  }
}

export {ItemSystemScript};
