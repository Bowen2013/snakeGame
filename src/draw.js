const clearCanvas = (canvas) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
  
const drawRecFromArray = (canvas, positions, fillColor, strokeColor) => {
  const ctx = canvas.getContext('2d');
  for(let i = 0; i < positions.length; i++) {
    let currPos = positions[i];
    ctx.fillStyle = fillColor;
    ctx.fillRect(currPos.x*20, currPos.y*20, 20, 20);
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(currPos.x*20, currPos.y*20, 20, 20);
  }
};
  
const drawGameOver = (canvas) => {
  const ctx = canvas.getContext('2d');
  ctx.font = '30px Clarkson';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width/2, canvas.height/2); 
};
  
  export {drawRecFromArray, clearCanvas, drawGameOver};