export default class GameController {
  gameRecorder;
  gameMap;
  isGameRunning;
  timer;

  constructor(gameRecorder, gameMap) {
    this.gameRecorder = gameRecorder;
    this.gameMap = gameMap;
    this.isGameRunning = false;
    this.timer = null;
  }

  autoMoveSnake() {
    this.isGameRunning = true;
    this.timer = setInterval(() => {
      if (this.gameMap.snake.isDead) {
        this.pauseGame();
        return;
      }
      this.gameMap.clearSnakeTail();
      this.gameMap.snake.move();
      this.gameMap.renderSnake();
    }, this.gameMap.snake.moveSpeed);
  }

  listenKeyboard() {
    return (event) => {
      event.preventDefault();
      switch (event.key) {
        case "ArrowUp":
          this.gameMap.snake.turnUp();
          break;
        case "ArrowDown":
          this.gameMap.snake.turnDown();
          break;
        case "ArrowLeft":
          this.gameMap.snake.turnLeft();
          break;
        case "ArrowRight":
          this.gameMap.snake.turnRight();
          break;
        case "Enter":
          this.pauseGame();
          break;
        case "r":
          this.resetGame();
          break;
      }
    };
  }

  pauseGame() {
    if (this.gameMap.snake.isDead) {
      return;
    }
    if (this.isGameRunning) {
      this.isGameRunning = false;
      this.clearTimer();
    } else {
      this.autoMoveSnake();
    }
  }

  resetGame() {
    this.gameRecorder.reset();
    this.gameMap.clearSelf();
    this.gameMap.snake.reborn();
    this.gameMap.snake.isDead = false;
    this.gameMap.renderSnake();
    this.gameMap.food.reGenerate();
    this.clearTimer();
    this.autoMoveSnake();
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
