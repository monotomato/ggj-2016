import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {rand} from 'Utils/NumUtil';
import {populateTemplate} from 'Utils/StringUtil';
import {resources} from 'Managers/ResourceManager';

class CrisisScript extends Script {
  constructor(parameters) {
    super(parameters);
  }

  init(parent, rootEntity) {
    this.village = rootEntity.findEntityWithTag('village');
    this.descriptions = resources.crisises.data.descriptions;
  }

  randomizeCrisis() {
    let itemTypes = [];
    while (itemTypes.length < 3) {
      let type = this.village.itemTypes[rand(this.village.itemTypes.length)];
      if (itemTypes.indexOf(type) === -1) {
        itemTypes.push(type);
      }
    }
    let crisis = {item1: itemTypes[0], item2: itemTypes[1], item3: itemTypes[2], villageName: this.village.name};
    crisis.description = populateTemplate(this.descriptions[rand(this.descriptions.length)], crisis);
    this.village.currentCrisis = crisis;
  }

  update(parent, rootEntity, delta) {
    if (!this.village.currentCrisis) {
      this.randomizeCrisis();
    }
  }

  handleGameEvent(parent, evt) {

  }
}

export {CrisisScript};
