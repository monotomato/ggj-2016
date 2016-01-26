import {log} from "Log";
import {ScriptSystem} from "Systems/ScriptSystem";

class Game {
  constructor() {
    this.stage = new Entity();
    this.ui = new Entity(); //new Entity("entity_ui");
    this.stage.addChild(ui);
    this.world = new Entity();
    this.stage.addChild(world);

    this.systems = [];
    let scriptSystem = new ScriptSystem();
    this.systems.push(scriptSystem);
  }

  update(delta) {
    this.systems.forEach((system) => {
      system.update(this.world, delta);
    });
  }

  render() {

  }
}
