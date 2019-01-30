import {drawRecFromArray} from './../draw.js';
import {Position} from './position.js';
import {WIDTH, HEIGHT} from './../constants.js';

class Food extends Position{
  constructor(x,y) {
    super(x,y);
  }

  create(occupiedSpot) {
    let cx = 0;
    let cy = 0;

    while (true) {

      cx = Math.floor(Math.random()*WIDTH);
      cy = Math.floor(Math.random()*HEIGHT);
      if (!occupiedSpot.has(cx*WIDTH + cy)) {
        break;
      }
    }
    this.x = cx;
    this.y = cy;
  }

  draw(canvas) {
    drawRecFromArray(canvas, [this], 'blue','white');
  }
}


export {Food};