import Cell from "@/class/game/cell.js";
import { nextInt } from "@/utils/randomUtils";

export default class Food extends Cell {
  x;
  y;
  score;
  gameMap;

  constructor(gameMap, foodColor, score) {
    super(gameMap.cellSize, foodColor);
    this.x = nextInt(0, gameMap.row - 1);
    this.y = nextInt(0, gameMap.column - 1);
    const snakeHead = gameMap.snake.head;
    while (this.x === snakeHead.x && this.y === snakeHead.y) {
      this.x = nextInt(0, gameMap.row - 1);
      this.y = nextInt(0, gameMap.column - 1);
    }
    this.score = score;
    this.gameMap = gameMap;
  }

  reGenerate() {
    const mapCellNum = this.gameMap.row * this.gameMap.column;
    if (this.gameMap.notEmptyCellNum > mapCellNum / 2) {
      this.indirectGenerate();
    } else {
      this.directGenerate();
    }
  }

  setScore(score) {
    this.score = score;
  }

  indirectGenerate() {
    const snakeNode = [];
    snakeNode.push({
      x: this.gameMap.snake.head.x,
      y: this.gameMap.snake.head.y,
    });
    if (this.gameMap.snake.bodys.length > 0) {
      for (let i = 0; i < this.gameMap.snake.bodys.length; i++) {
        snakeNode.push({
          x: this.gameMap.snake.bodys[i].x,
          y: this.gameMap.snake.bodys[i].y,
        });
      }
    }
    const emptyCells = [];
    for (let i = 0; i < this.gameMap.row; i++) {
      for (let j = 0; j < this.gameMap.column; j++) {
        let flag = true;
        for (let k = 0; k < snakeNode.length; k++) {
          if (i === snakeNode[k].x && j === snakeNode[k].y) {
            flag = false;
            break;
          }
        }
        if (flag) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }
    if (emptyCells.length === 0) {
      this.gameMap.snake.isDead = true;
      return;
    }
    const randomIndex = nextInt(0, emptyCells.length - 1);
    const randomCell = emptyCells[randomIndex];
    this.occupyRender(randomCell.x, randomCell.y);
  }

  directGenerate() {
    const snake = this.gameMap.snake;
    let x = nextInt(0, this.gameMap.row - 1);
    let y = nextInt(0, this.gameMap.column - 1);
    while (
      snake.bodys.some((body) => {
        return x === body.x && y === body.y;
      }) ||
      (x === snake.head.x && y === snake.head.y)
    ) {
      x = nextInt(0, this.gameMap.row - 1);
      y = nextInt(0, this.gameMap.column - 1);
    }
    this.occupyRender(x, y);
  }

  occupyRender(x, y) {
    this.x = x;
    this.y = y;
    this.gameMap.notEmptyCellNum++;
    this.gameMap.renderFood();
  }
}
