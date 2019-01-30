import {drawRecFromArray} from './../draw.js';
import {Position} from './position.js';

class Snake {
  constructor() {
    this.positions = [];
  }

  create(arr) {
    this.positions = [];
    for(let i = 0; i < arr.length; i++) {
      this.positions.push(new Position(arr[i][0], arr[i][1]));
    }
  }

  draw(canvas) {
    drawRecFromArray(canvas, this.positions, 'black', 'white');
  }
}

export {Snake};