import {log} from 'Log';

class Physics {
  constructor() {
    this.dynamicBodies = [];
    this.staticBodies = [];
    this.behaviors = [];
  }

  step(delta) {
    this.dynamicBodies.forEach((body) => {
      body.pos.x += body.vel.x * delta;
      body.pos.y += body.vel.y * delta;

      this.behaviors.forEach((behavior) => {
        for (let key in behavior) {
          body[key].x += behavior[key].x * delta;
          body[key].y += behavior[key].y * delta;
        }
      });
    });
  }

  addBehavior(behavior) {
    this.behaviors.push(behavior);
  }

  addEntity(entity) {
    if (entity.physics && entity.physics.body) {
      if (entity.physics.body.static) {
        this.staticBodies.push(entity.physics.body);
      } else {
        this.dynamicBodies.push(entity.physics.body);
      }
    } else {
      log.debug('Cannot add to physics: entity does not have a body!');
    }
  }

  static body(bodyType, options) {
    let body = {
      pos: {
        x: 0,
        y: 0
      },
      vel: {
        x: 0,
        y: 0
      },
      static: false
    };
    body.pos.x = options.x | 0;
    body.pos.y = options.y | 0;
    if (options.treatment === 'static') {
      body.static = true;
    }
    Object.assign(body, options);
    log.debug(body);
    return body;
  }
}

export {Physics};
