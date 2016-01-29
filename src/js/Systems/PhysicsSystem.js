import {System} from "System";
import {log} from "Log";
import cfg from 'config.json';

class PhysicsSystem extends System {
  constructor(timeStep = 3, maxIPF = 16, integrator = 'verlet') {
    super();
    this.time = 0.0;
    this.world = Physics({
      // set the timestep
      timestep: timeStep,
      // maximum number of iterations per step
      maxIPF: maxIPF,
      // set the integrator (may also be set with world.add())
      integrator: integrator,
      //Nothing sleeps
      sleepDisabled: true
    });
    if (cfg.debugMode) this.debug();
  }

  debug() {
    let gravity = Physics.behavior('constant-acceleration');
    this.world.add(gravity);

    let viewportBounds = Physics.aabb(0, 0, cfg.renderer.size.x, cfg.renderer.size.y);

    let edgeBounce = Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds,
        restitution: 0.0,
        cof: 0.0
    });

    this.world.add(edgeBounce);
    this.world.add([
      Physics.behavior('sweep-prune'),
      Physics.behavior('body-collision-detection'),
      Physics.behavior('body-impulse-response')
    ]);
  }

  applySystem(entity, rootEntity, delta) {
    if (entity.physics) {
      // Add the entity if it isn't in the world yet
      if (!entity.physics.inWorld) {
        log.debug('Adding to world');
        this.world.add(entity.physics.body);
        entity.physics.inWorld = true;
        log.debug(entity.physics.body.state);
      }
      // Update the position of the entity to that of the
      // body

      // if (entity.physics.body.state.pos.x > 0) log.debug(entity.physics.body);
      entity.position = {
        x: entity.physics.body.state.pos.x,
        y: entity.physics.body.state.pos.y
      };
    }
  }

  updateSystem(rootEntity, delta) {
    this.time += delta;
    this.world.step(this.time);
    // log.debug(this.world);
  }
}

export {PhysicsSystem};
