import {config} from './config.js';
import {LEFT, UP, RIGHT, DOWN, WIDTH, HEIGHT} from './constants.js'
import {drawRecFromArray, clearCanvas, drawGameOver} from './draw.js';
import {Position} from './model/position.js';
import {Food} from './model/food.js';
import {Snake} from './model/snake.js';

const gameSpeed = config.gameSpeed;
const initPositions = config.snakeInitPositions;

const canvas = document.getElementById('snakeCanvas');
const startButton = document.getElementById("startButton");
const currScoreEle = document.getElementById("currScore");
const bestScoreEle = document.getElementById("bestScore");

let bestScore = 0;
let currScore = 0;
let gameOver = false;
let direction = config.snakeInitDirection;
let food = new Food();
let snake = new Snake();
// save which position is currently occupied by snake body
let occupiedSpot = new Set();
// help setInterval and clearInterval
let timer = undefined;
// keep track if snake has moved since last key press
let movedSinceLastKeyDown;

/**
 * Function: inBound
 * check if given position is in bound
 *
 * Parameters:
 * position - {Object}
 * width - {Number}
 * height - {Number}
 *
 * Returns:
 * {Boolean} True if position is in bound. False otherwise
 */
const inBound = (position, width, height) => {
  return position.x >= 0 && position.x < width && position.y >= 0 && position.y < height;
};

const updateParagraphContent = (element, text) => element.innerHTML = text;
const updateCurrScore = () => updateParagraphContent(currScoreEle, `Current Score: ${currScore}`);
const updateBestScore = () => updateParagraphContent(bestScoreEle, `Best Score: ${bestScore}`);

/**
 * Function: move
 * Move snakes.
 *
 * Parameters:
 *
 * Returns:
 * {Number} -1 means snake hits the bound or bites itself; 1 means normal move; 2 means snake eats food
 */
const move = () => {
  let flag = -1;
  if (gameOver) {
    return flag;
  }

  let incx = 0;
  let incy = 0;

  switch (direction) {
    case LEFT: incx = -1; incy = 0; break;
    case UP: incx = 0; incy = -1; break;
    case RIGHT: incx = 1; incy = 0; break;
    case DOWN: incx = 0; incy = 1; break;
    default: break;
  }

  // last element is snake head
  const snakeHead = snake.positions[snake.positions.length-1];
  const newPos = new Position(snakeHead.x + incx, snakeHead.y + incy);
  const newposIndex = newPos.x * WIDTH + newPos.y;

  // check if snake head is out of bound
  if (!inBound(newPos, WIDTH, HEIGHT)) {
    gameOver = true;
    return flag;
  }

  // snake bites itself
  if (occupiedSpot.has(newposIndex)) {
    return flag;
  } else {
    flag = 1;
    occupiedSpot.add(newposIndex);
  }

  // add new position to snake head
  snake.positions.push(newPos);

  // if this new position is food, update score and create new food
  if (newPos.x === food.x && newPos.y === food.y) {
    currScore++;
    flag = 2;
  } else {
    // remove tail from snake and occupiedSpot set
    const snakeTail = snake.positions.shift();
    const snakeTailIndex= snakeTail.x * WIDTH + snakeTail.y;
    occupiedSpot.delete(snakeTailIndex);
  }

  movedSinceLastKeyDown = true;
  return flag;
};

/**
 * Function: addKeyControl
 * add left, up, right and down key control from keyboard. 
 * movedSinceLastKeyDown helps to check if snake has moved since last key press. For example, if snake 
 * goes right and user presses Down then Left too fast, then it will go left since last direction 'was' down.
 *
 * Parameters:
 *
 * Returns:
 */
const addKeyControl = () => {
  document.onkeydown = (key) => {
    if (movedSinceLastKeyDown) {
      switch(key.which) {
        case LEFT:
          if (direction !== RIGHT) {
            direction = LEFT;
          }
          break;
        case UP:
          if (direction !== DOWN) {
            direction = UP;
          }
          break;
        case RIGHT:
          if (direction !== LEFT) {
              direction = RIGHT;
          }
          break;
        case DOWN:
          if (direction !== UP) {
            direction = DOWN;
          }
          break;
      }
      movedSinceLastKeyDown = false;
    }
  };
};

/**
 * Function: refreshCanvasDrawing
 * Clean up current canvas and redraw food and snake
 *
 * Parameters:
 *
 * Returns:
 */
const refreshCanvasDrawing = () => {
  clearCanvas(canvas);
  food.draw(canvas);
  snake.draw(canvas);
};

/**
 * Function: resetGame
 * Initialize/reset game status, snake, food, canvas and so on. 
 *
 * Parameters:
 *
 * Returns:
 */
const resetGame = () => {
  gameOver = false;
  // clear curr score
  currScore = 0;
  updateCurrScore();

  if (timer !== undefined) {
    clearInterval(gameLoop);
  }

  // init occupied spot
  occupiedSpot.clear();
  for(let i = 0; i < initPositions.length; i++) {
    occupiedSpot.add(initPositions[i][0] * WIDTH + initPositions[i][1]);
  }

  // init food 
  food.create(occupiedSpot);
  // init snake
  snake.create(initPositions);
  direction = config.snakeInitDirection;

  // init food and snake in canvas
  refreshCanvasDrawing();
};

/**
 * Function: stopGame
 * stop game, update score and draw game over text in canvas
 * Parameters:
 *
 * Returns:
 */
const stopGame = () => {
  clearInterval(timer);
  clearCanvas(canvas);
  drawGameOver(canvas, 'red');
  if (currScore >= bestScore) {
    bestScore = currScore;
    updateBestScore();
  }
};

/**
 * Function: gameLoop
 * Move snake towards current direction
 * Parameters:
 *
 * Returns:
 */
const gameLoop = () => {
  let rst = move(direction);
  if(rst === -1) { // this move either hits wall or bites itself
    // console.log('gameover');
    stopGame();
    return;
  } else if (rst === 2) { // this move eats food
    food.create(occupiedSpot);
    updateCurrScore();
  } 
  refreshCanvasDrawing();
};

/**
 * Function: startGame
 * Move snake with given interval time
 * Parameters:
 *
 * Returns:
 */
const startGame = () => {
  timer = setInterval(gameLoop,gameSpeed);
};

/**
 * Function: clickButtonEvent
 * restart game when clicking start button
 * Parameters:
 *
 * Returns:
 */
const clickButtonEvent = () => {
  resetGame();
  startGame();
};

/**
 * Function: init
 * Initialization function
 *
 * Parameters:
 *
 * Returns:
 */
const init = () => {
  addKeyControl();

  updateCurrScore();
  updateBestScore();

  startButton.addEventListener('click', clickButtonEvent);
};
init();