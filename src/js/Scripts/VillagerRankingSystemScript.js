import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';
import {populateTemplate} from 'Utils/StringUtil';

class VillagerRankingSystemScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.eventTypes.push(
      'rank_change',
      'day_end',
      'villager_ritualized'
    );
    this.rankChanges = [];
    this.villagers = [];
  }

  init(parent, rootEntity) {
  }

  update(parent, rootEntity, delta) {

  }

  applyRankChanges() {
    for (let i = 0; i < this.rankChanges.length; i++) {
      let rankChange = this.rankChanges[i];
      let villagerRank = findVillagerIndex(rankChange.villagerName);
      let change = rankChange.rankChange;
      if ((villagerRank === 0 && change === -1) || (villagerRank === this.villagers.size - 1 && change === 1)) {
        continue;
      }
      let swap = this.villagers[villagerRank + change];
      this.villagers[villagerRank + change] = this.villagers[villagerRank];
      this.villagers[villagerRank] = swap;
    }
    EventMan.publish({eventType: 'rank_applied', parameters: {rankChanges: this.rankChanges}});
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
    } else if (evt.eventType === 'day_end') {
      this.applyRankChanges();
    } else if (evt.eventType === 'villagers_updated') {
      this.villagers = parent.villagerIdentitySystemScript.villagers;
    }
  }
}

export {VillagerRankingSystemScript};
