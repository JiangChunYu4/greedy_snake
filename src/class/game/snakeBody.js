import Cell from "@/class/game/cell.js";

export default class SnakeBody extends Cell {
  x;
  y;
  
  constructor(gameMap, x, y, bodyColor) {
    super(gameMap.cellSize, bodyColor);
    this.x = x;
    this.y = y;
  }
}
