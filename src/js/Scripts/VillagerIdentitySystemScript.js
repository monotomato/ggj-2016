import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {resources} from 'Managers/ResourceManager';
import {rand} from 'Utils/NumUtil';
import {Entity} from 'Entity';

class VillagerIdentitySystemScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'villager_ritualized'
    );
  }

  init(parent, rootEntity) {
    this.villagers = [];
    this.village = rootEntity.findEntityWithTag('village');
    this.village.houses = this.village.houses || rootEntity.findEntitiesWithTag('location_house');

    let spawner = rootEntity.findEntityWithTag('spawn_villager');

    // parent.villagers = rootEntity.findEntitiesWithTag('villager');
    parent.villagers = this.villagers;
    // log.debug(parent);

    this.roles = [];
    this.reservedNames = [];

    let freeHouses = [];

    this.villages.houses.forEach(h => {
      if (h.name.indexOf('town_hall') === -1) {
        freeHouses.push(h);
      }
    });

    resources.identities.data.roles.forEach(e => this.roles.push(e));

    let fnames = resources.identities.data.fnames;
    let snames = resources.identities.data.snames;
    this.villagers.forEach(villager => {
      if (villager.tags.indexOf('player') === -1) {
        let name;
        do {
          let fname = fnames[rand(fnames.length)];
          let sname = snames[rand(snames.length)];
          name = fname + ' ' + sname;
        } while (this.reservedNames.indexOf(name) !== -1);
        this.reservedNames.push(name);
        let role = this.roles.splice(rand(this.roles.length), 1)[0];
        villager.name = name;
        villager.role = role;
      } else {
        villager.name = 'sheep';
        villager.role = 'sheep';
      }
    });
  }

  update(parent, rootEntity, delta) {
    if (!this.firstUpdate) {
      EventMan.publish({eventType: 'villagers_updated', parameters: {updateType: 'identified'}});
      this.firstUpdate = true;
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'villager_ritualized') {
      let rem;
      for (let i = 0; i < this.villagers.length; i++) {
        if (this.villagers[i].name === evt.parameters.villagerName) {
          rem = i;
          break;
        }
      }
      if (rem) {
        this.villagers.splice(rem, 1);
      }
      EventMan.publish({eventType: 'villagers_updated', parameters: {updateType: 'ritualized'}});
    }
  }
}

export {VillagerIdentitySystemScript};
