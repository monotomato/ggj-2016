import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {populateTemplate} from 'Utils/StringUtil';

class VillagerRankingSystemScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'rank_change',
      'rank_apply',
      'villagers_updated'
    );
    this.rankChanges = [];
    this.villagers = [];
  }

  init(parent, rootEntity) {
    this.village = rootEntity.findEntityWithTag('village');
  }

  update(parent, rootEntity, delta) {

  }

  applyRankChanges() {
    let ranks = {};
    for (let i = 0; i < this.village.villagers.length; i++) {
      ranks[this.village.villagers[i].name] = i;
    }
    for (let i = 0; i < this.rankChanges.length; i++) {
      let rankChange = this.rankChanges[i];
      ranks[rankChange.villagerName] += rankChange.rankChange;
    }
    for (let i = 0; i < this.village.villagers.length; i++) {
      let name = this.village.villagers[i].name;
      log.debug(name + ' ' + ranks[name]);
    }
    this.villagers.sort((l, r) => {
        return ranks[l.name] - ranks[r.name];
    });
    EventMan.publish({eventType: 'rank_apply_end', parameters: {rankChanges: this.rankChanges}});
    this.rankChanges = [];
  }

  findVillager(name) {
    return this.villagers[findVillagerIndex(name)];
  }

  findVillagerIndex(name) {
    for (let i = 0; i < this.villagers.length; i++) {
      let v = this.villagers[i];
      if (v.name === name) {
        return i;
      }
    }
  }

  handleGameEvent(parent, evt) {
    if (evt.eventType === 'rank_change') {
      this.rankChanges.push({villagerName: evt.parameters.villagerName, rankChange: evt.parameters.rankChange});
    } else if (evt.eventType === 'rank_apply_start') {
      this.applyRankChanges();
    } else if (evt.eventType === 'villagers_updated') {
      this.villagers = parent.villagers;
    }
  }
}

export {VillagerRankingSystemScript};
