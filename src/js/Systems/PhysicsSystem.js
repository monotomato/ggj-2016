import {System} from 'System';
import {log} from 'Log';
import cfg from 'config.json';
import {Physics} from 'Physics';

class PhysicsSystem extends System {
  constructor(timeStep = 3, maxIPF = 16, integrator = 'verlet') {
    super();
    this.world = new Physics();
    // this.time = 0.0;
    // this.world = Physics({
    //   // set the timestep
    //   timestep: timeStep,
    //   // maximum number of iterations per step
    //   maxIPF: maxIPF,
    //   // set the integrator (may also be set with world.add())
    //   integrator: integrator,
    //   //Nothing sleeps
    //   sleepDisabled: true
    // });
    if (cfg.debugMode) this.debug();
  }

  addEntity(entity) {
    if (entity.physics && entity.physics.body) {
      if (entity.physics.body.static) {
        this.world.staticBodies.push(entity.physics.body);
      } else if (entity.physics.body.trigger) {
         this.world.triggers.push(entity.physics.body);
      } else {
        this.world.dynamicBodies.push(entity.physics.body);
      }
    } else {
      log.debug('Cannot add to physics: entity does not have a body!');
    }
  }


  debug() {
    this.world.addBehavior({
      vel: {
        x: 0,
        y: 0.0012
      }
    });
  }

  applySystem(entity, rootEntity, delta) {
    if (entity.physics) {
      if (!entity.physics.inWorld) {
        // log.debug('Adding to world');
        this.world.addEntity(entity);
        entity.physics.inWorld = true;
        // log.debug(entity.physics.body.state);
      }
      // Update the position of the entity to that of the
      // body
      entity.position = {
        x: entity.physics.body.pos.x,
        y: entity.physics.body.pos.y
      };
    }
  }

  updateSystem(rootEntity, delta) {
    this.world.step(delta);
    // log.debug(this.world);
  }
}

export {PhysicsSystem};
