import {log} from 'Log';

class Collision {

  static aabbTestFast(a, b) {
    let aHalfWidth = a.width/2.0;
    let aHalfHeight = a.height/2.0;
    let bHalfWidth = b.width/2.0;
    let bHalfHeight = b.height/2.0;

    let xDif = a.pos.x - b.pos.x;
    let yDif = a.pos.y - b.pos.y;

    let intersectX = Math.abs(xDif) - (aHalfWidth + bHalfWidth);
    let intersectY = Math.abs(yDif) - (aHalfHeight + bHalfHeight);

    return intersectX < 0 && intersectY < 0;
  }

  static aabbTest(a, b) {
    let aHalfWidth = a.width/2.0;
    let aHalfHeight = a.height/2.0;

    let bHalfWidth = b.width/2.0;
    let bHalfHeight = b.height/2.0;

    let xDif = a.pos.x - b.pos.x;
    let yDif = a.pos.y - b.pos.y;

    let intersectX = Math.abs(xDif) - (aHalfWidth + bHalfWidth);
    let intersectY = Math.abs(yDif) - (aHalfHeight + bHalfHeight);

    if (intersectX < 0 && intersectY < 0) {
      if (Math.abs(intersectX) < Math.abs(intersectY)) {
        return {x: intersectX * Math.sign(xDif), y: 0};
      } else {
        return {x: 0, y: intersectY * Math.sign(yDif)};
      }
    } else {
      return {x: 0, y: 0};
    }
  }
}

export {Collision};
