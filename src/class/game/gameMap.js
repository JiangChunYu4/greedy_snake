import Cell from "@/class/game/cell.js";

export default class GameMap {
  row;
  column;
  cells;
  cellSize;
  cellGap;
  cellBgColor;
  notEmptyCellNum;
  food;
  snake;

  constructor(row, column, cellSize, cellGap, cellBgColor) {
    this.row = row;
    this.column = column;
    this.cellSize = cellSize;
    this.cellGap = cellGap;
    this.cellBgColor = cellBgColor;
    this.notEmptyCellNum = 0;
    this.cells = [];
    for (let i = 0; i < this.row; i++) {
      const arr = [];
      for (let j = 0; j < this.column; j++) {
        arr.push(new Cell(this.cellSize, cellBgColor));
      }
      this.cells.push(arr);
    }
  }

  addFood(food) {
    this.food = food;
    this.notEmptyCellNum++;
  }

  addSnake(snake) {
    this.snake = snake;
    this.notEmptyCellNum++;
  }

  setCellBgColor(x, y, bgColor) {
    if (x < 0 || x >= this.row || y < 0 || y >= this.column) {
      return;
    }
    this.cells[x][y].bgColor = bgColor;
  }

  renderFood() {
    this.setCellBgColor(this.food.x, this.food.y, this.food.bgColor);
  }

  renderSnake() {
    this.setCellBgColor(
      this.snake.head.x,
      this.snake.head.y,
      this.snake.head.bgColor
    );
    this.snake.bodys.forEach((body) => {
      this.setCellBgColor(body.x, body.y, body.bgColor);
    });
  }

  clearSnakeTail() {
    if (this.snake.bodys.length === 0) {
      this.setCellBgColor(this.snake.head.x, this.snake.head.y, this.cellBgColor);
      return;
    }
    const tail = this.snake.bodys[this.snake.bodys.length - 1];
    this.setCellBgColor(tail.x, tail.y, this.cellBgColor);
  }

  clearSelf() {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.column; j++) {
        this.setCellBgColor(i, j, this.cellBgColor);
      }
    }
    this.notEmptyCellNum = 0;
  }
}
