import {log} from 'Log';
import {Script} from 'Script';
import {EventMan} from 'Managers/EventManager';

class CrisisScript extends Script {
  constructor(parameters) {
    super(parameters);
    this.crisisIngredients = [];
  }

  init(parent, rootEntity) {

  }

  randomizeIngredients() {

  }

  update(parent, rootEntity, delta) {
  }

  handleGameEvent(parent, evt) {

  }
}

export {CrisisScript};
