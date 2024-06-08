import { nextInt } from "@/utils/randomUtils";
import SnakeHead from "@/class/game/snakeHead.js";
import SnakeBody from "@/class/game/snakeBody.js";

export default class Snake {
  head;
  bodys;
  bodyColor;
  moveDirection;
  lastDirectionChange;
  directionLockTime;
  isDead;
  moveSpeed;
  gameRecorder;
  gameMap;
  static MOVE_DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
  };

  constructor(gameRecorder, gameMap, headColor, bodyColor, moveSpeed) {
    this.head = new SnakeHead(gameMap, headColor);
    this.bodys = [];
    this.bodyColor = bodyColor;
    this.moveDirection = nextInt(
      0,
      Object.keys(Snake.MOVE_DIRECTION).length - 1
    );
    this.lastDirectionChange = 0;
    this.directionLockTime = Math.floor((moveSpeed / 10) * 6);
    this.isDead = false;
    this.moveSpeed = moveSpeed;
    this.gameRecorder = gameRecorder;
    this.gameMap = gameMap;
  }

  turnLeft() {
    const currentTime = Date.now();
    if (currentTime - this.lastDirectionChange < this.directionLockTime) {
      return;
    }
    if (this.moveDirection === Snake.MOVE_DIRECTION.RIGHT) {
      return;
    }
    this.moveDirection = Snake.MOVE_DIRECTION.LEFT;
    this.lastDirectionChange = currentTime;
  }

  turnRight() {
    const currentTime = Date.now();
    if (currentTime - this.lastDirectionChange < this.directionLockTime) {
      return;
    }
    if (this.moveDirection === Snake.MOVE_DIRECTION.LEFT) {
      return;
    }
    this.moveDirection = Snake.MOVE_DIRECTION.RIGHT;
    this.lastDirectionChange = currentTime;
  }

  turnUp() {
    const currentTime = Date.now();
    if (currentTime - this.lastDirectionChange < this.directionLockTime) {
      return;
    }
    if (this.moveDirection === Snake.MOVE_DIRECTION.DOWN) {
      return;
    }
    this.moveDirection = Snake.MOVE_DIRECTION.UP;
    this.lastDirectionChange = currentTime;
  }

  turnDown() {
    const currentTime = Date.now();
    if (currentTime - this.lastDirectionChange < this.directionLockTime) {
      return;
    }
    if (this.moveDirection === Snake.MOVE_DIRECTION.UP) {
      return;
    }
    this.moveDirection = Snake.MOVE_DIRECTION.DOWN;
    this.lastDirectionChange = currentTime;
  }

  move() {
    if (this.isDead) {
      return;
    }
    switch (this.moveDirection) {
      case Snake.MOVE_DIRECTION.UP:
        this.moveUp();
        break;
      case Snake.MOVE_DIRECTION.DOWN:
        this.moveDown();
        break;
      case Snake.MOVE_DIRECTION.LEFT:
        this.moveLeft();
        break;
      case Snake.MOVE_DIRECTION.RIGHT:
        this.moveRight();
        break;
    }
  }

  moveUp() {
    if (this.head.x === 0 || this.mayEatSelf(this.head.x - 1, this.head.y)) {
      this.isDead = true;
      return;
    }
    const tail =
      this.bodys.length === 0
        ? JSON.parse(JSON.stringify(this.head))
        : JSON.parse(JSON.stringify(this.bodys[this.bodys.length - 1]));
    this.moveBody();
    this.head.x--;
    this.mayEatFood(tail);
  }

  moveDown() {
    if (
      this.head.x === this.gameMap.row - 1 ||
      this.mayEatSelf(this.head.x + 1, this.head.y)
    ) {
      this.isDead = true;
      return;
    }
    const tail =
      this.bodys.length === 0
        ? JSON.parse(JSON.stringify(this.head))
        : JSON.parse(JSON.stringify(this.bodys[this.bodys.length - 1]));
    this.moveBody();
    this.head.x++;
    this.mayEatFood(tail);
  }

  moveLeft() {
    if (this.head.y === 0 || this.mayEatSelf(this.head.x, this.head.y - 1)) {
      this.isDead = true;
      return;
    }
    const tail =
      this.bodys.length === 0
        ? JSON.parse(JSON.stringify(this.head))
        : JSON.parse(JSON.stringify(this.bodys[this.bodys.length - 1]));
    this.moveBody();
    this.head.y--;
    this.mayEatFood(tail);
  }

  moveRight() {
    if (
      this.head.y === this.gameMap.column - 1 ||
      this.mayEatSelf(this.head.x, this.head.y + 1)
    ) {
      this.isDead = true;
      return;
    }
    const tail =
      this.bodys.length === 0
        ? JSON.parse(JSON.stringify(this.head))
        : JSON.parse(JSON.stringify(this.bodys[this.bodys.length - 1]));
    this.moveBody();
    this.head.y++;
    this.mayEatFood(tail);
  }

  moveBody() {
    if (this.bodys.length === 0) {
      return;
    }
    for (let i = this.bodys.length - 1; i >= 1; i--) {
      this.bodys[i].x = this.bodys[i - 1].x;
      this.bodys[i].y = this.bodys[i - 1].y;
    }
    this.bodys[0].x = this.head.x;
    this.bodys[0].y = this.head.y;
  }

  mayEatSelf(headX, headY) {
    for (let i = 0; i < this.bodys.length; i++) {
      if (headX === this.bodys[i].x && headY === this.bodys[i].y) {
        return true;
      }
    }
    return false;
  }

  mayEatFood(tail) {
    if (
      this.head.x === this.gameMap.food.x &&
      this.head.y === this.gameMap.food.y
    ) {
      this.bodys.push(
        new SnakeBody(this.gameMap, tail.x, tail.y, this.bodyColor)
      );
      this.gameRecorder.addScore(this.gameMap.food.score);
      this.gameRecorder.addEated();
      this.gameMap.food.reGenerate();
      this.gameMap.food.setScore(this.gameRecorder.nextScore());
    }
  }

  reborn() {
    this.bodys.splice(0, this.bodys.length);
    const headX = nextInt(0, this.gameMap.row - 1);
    const headY = nextInt(0, this.gameMap.column - 1);
    this.head.reset(headX, headY);
    this.isDead = false;
  }
}
