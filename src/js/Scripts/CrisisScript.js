import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {rand} from 'Utils/NumUtil';
import {populateTemplate} from 'Utils/StringUtil';
import {resources} from 'Managers/ResourceManager';
import {Collision} from 'Collision';

class CrisisScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'rank_apply_end',
      'item_thrown'
    );
  }

  init(parent, rootEntity) {
    this.parent = parent;
    this.village = rootEntity.findEntityWithTag('village');
    this.sign = rootEntity.findEntityWithName('crisis_sign');
    this.data = resources.crisises.data.crisises;
    this.crisisIndex = 0;
  }

  randomizeCrisis() {
    let itemTypes = [];

    let select = this.data[this.crisisIndex];
    this.requiredItems = [];
    while (itemTypes.length < select.itemCount) {
      let type = this.village.itemTypes[rand(this.village.itemTypes.length)];
      if (itemTypes.indexOf(type) === -1) {
        this.requiredItems.push(this.village.rawTypesByName[type]);
        itemTypes.push(type);
      }
    }
    this.timeLeft = select.duration;
    let crisis = {villageName: this.village.name};
    for (let i = 0; i < itemTypes.length; i++) {
      crisis['item' + (i + 1)] = itemTypes[i];
    }

    crisis.description = populateTemplate(select.desc, crisis);

    this.village.currentCrisis = crisis;

    log.debug(this.sign);
    
    EventMan.publish({eventType: 'change_text',
      parameters: {
        target: this.sign,
        text: this.village.currentCrisis.description
      }
    });
  }

  nextCrisis() {
    this.crisisIndex++;
    if (this.crisisIndex >= this.data.length) {
      this.crisisIndex = 0;
    }
    this.randomizeCrisis();
  }

  advanceDay() {
    this.timeLeft--;
    if (this.timeLeft === 0) {
      if (this.requiredItems.length === 0) {
        this.crisisAverted();
      } else {
        this.crisisFailed();
      }
      this.nextCrisis();
    }
  }

  crisisFailed() {
    EventMan.publish({eventType: 'villager_ritualized',
     parameters: {villagerName: this.village.villagers[this.village.villagers.length - 1].name}});
  }

  crisisAverted() {
    EventMan.publish({eventType: 'rank_change', parameters: {villagerName: this.village.player.name, rankChange: -1.1}});
  }

  update(parent, rootEntity, delta) {
    if (!this.village.currentCrisis) {
      this.randomizeCrisis();
    }
  }

  updateCrisisNeeds(item) {
    let newReq = [];
    this.requiredItems.forEach(req => {
      if (item.tags.indexOf(req) === -1) {
        newReq.push(req);
      }
    });
    if (newReq.length < this.requiredItems.length) {
      item.physics.body.pos.x = 150000;
      this.requiredItems = newReq;
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'rank_apply_end') {
      this.advanceDay();
    } else if (evt.eventType === 'item_thrown') {
      if (Collision.aabbTestFast(this.parent.physics.body, evt.parameters.item.physics.body)) {
        this.updateCrisisNeeds(evt.parameters.item);
      }
    }
  }
}

export {CrisisScript};
