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
    this.sign = rootEntity.findEntityWithName('crisis_sign');
    this.data = resources.crisises.data.crisises;
  }

  randomizeCrisis() {
    let itemTypes = [];
    log.debug(this.data);
    let select = this.data[0]; //TODO
    while (itemTypes.length < select.itemCount) {
      let type = this.village.itemTypes[rand(this.village.itemTypes.length)];
      if (itemTypes.indexOf(type) === -1) {
        itemTypes.push(type);
      }
    }
    let crisis = {villageName: this.village.name};
    for (let i = 0; i < itemTypes.length; i++) {
      crisis['item' + (i + 1)] = itemTypes[i];
    }

    crisis.description = populateTemplate(select.desc, crisis);

    this.village.currentCrisis = crisis;
  }

  update(parent, rootEntity, delta) {
    if (!this.village.currentCrisis) {
      this.randomizeCrisis();
      let cris = this.village.currentCrisis;

      EventMan.publish({eventType: 'change_text',
        parameters: {
          target: this.sign,
          text: cris.description
        }
      });

    }
  }

  handleGameEvent(parent, evt) {

  }
}

export {CrisisScript};
