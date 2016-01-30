import {log} from 'Log';
import {Collision} from 'Collision';

class Physics {
  constructor() {
    this.dynamicBodies = [];
    this.staticBodies = [];
    this.triggers = [];
    this.behaviors = [];
  }

  copyBody(from, to) {
    jQuery.extend(true, to, from);
  }

  checkCollisionFast(body, delta) {
    let newBody = {};
    this.copyBody(body, newBody);
    newBody.pos.x += newBody.vel.x * delta;
    newBody.pos.y += newBody.vel.y * delta;

    this.behaviors.forEach((behavior) => {
      for (let key in behavior) {
        newBody[key].x += behavior[key].x * delta;
        newBody[key].y += behavior[key].y * delta;
      }
    });

    var collided = this.staticBodies.find((staticBod) => {
      return Collision.aabbTestFast(newBody, staticBod);
    });
    return collided;
  }

  lengthSquared(v) {
    return v.x * v.x + v.y * v.y;
  }

  checkCollision(body, delta) {
    let newBody = {};
    this.copyBody(body, newBody);
    if (!newBody.freeze.x) {
      newBody.pos.x += newBody.vel.x * delta;
    }
    if (!newBody.freeze.y) {
      newBody.pos.y += newBody.vel.y * delta;
    }

    this.behaviors.forEach((behavior) => {
      for (let key in behavior) {
        newBody[key].x += behavior[key].x * delta;
        newBody[key].y += behavior[key].y * delta;
      }
    });

    for (let i = 0; i < this.staticBodies.length; i++) {
      let sBod = this.staticBodies[i];
      let t = Collision.aabbTest(newBody, sBod);
      if (this.lengthSquared(t) > 0) {
        return t;
      }
    }
    return {x: 0, y: 0};
  }

  binarySearchCollision(body, delta, tolerance) {
    if (this.lengthSquared(this.checkCollision(body, 0)) > 0) {
      return 0;
    }
    let low = 0.0;
    let high = delta;
    let mid = ((low + high) / 2.0);
    let collision = this.checkCollision(body, mid);
    let l = this.lengthSquared(collision);
    let count = 0;
    while ((l > tolerance || l === 0) && count < 32) {
      if (l > tolerance) {
        high = mid;
      } else if (l === 0) {
        low = mid;
      }
      mid = ((low + high) / 2.0);
      // console.log("low: ", low);
      // console.log("high: ", high);
      // console.log("mid: ", mid);
      collision = this.checkCollision(body, mid);
      l = this.lengthSquared(collision);
      // console.log("l: ", l);
      count++;
    }

    return mid;
  }

  calcStep(body, delta) {
    body.pos.x += body.vel.x * delta;
    body.pos.y += body.vel.y * delta;

    this.behaviors.forEach((behavior) => {
      for (let key in behavior) {
        body[key].x += behavior[key].x * delta;
        body[key].y += behavior[key].y * delta;
      }
    });
  }

  step(delta) {
    this.dynamicBodies.forEach((body) => {
      if (body.awake) {
        body.freeze = {
          x: false,
          y: false
        };
        let collided = this.checkCollisionFast(body, delta);
        if (!collided) {
          this.calcStep(body, delta);
          let col = this.checkCollision(body, 0);
          body.pos.y -= col.y;
          body.pos.x -= col.x;
        } else {
          let remaining = delta;
          let count = 0;
          while (remaining >= 0 && count < 6) {
            count++;
            let d = this.binarySearchCollision(body, remaining, 0.1);
            this.calcStep(body, d);
            remaining -= delta;
            let col = this.checkCollision(body, 0);
            if (col.y !== 0.0) {
              if (Math.sign(body.vel.y) === Math.sign(col.y)) {
                body.vel.y = 0;
                body.freeze.y = true;
              }
              body.vel.x /= 2.0;
            } else if (col.x !== 0.0) {
              if (Math.sign(body.vel.x) !== Math.sign(col.x)) {
                body.vel.x = 0;
                body.freeze.x = true;
              }
            }
            body.pos.y -= col.y;
            body.pos.x -= col.x;
          }
        }
      }
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
      static: false,
      awake: true
    };
    body.pos.x = options.x | 0;
    body.pos.y = options.y | 0;
    if (options.treatment === 'static') {
      body.static = true;
    } else if (options.treatment === 'trigger') {
      body.trigger = true;
    }
    Object.assign(body, options);
    // log.debug(body);
    return body;
  }
}

export {Physics};
