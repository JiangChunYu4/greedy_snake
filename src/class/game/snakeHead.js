import Cell from "@/class/game/cell.js";
import { nextInt } from "@/utils/randomUtils";

export default class SnakeHead extends Cell {
  x;
  y;
  
  constructor(gameMap, headColor) {
    super(gameMap.cellSize, headColor);
    this.x = nextInt(0, gameMap.row - 1);
    this.y = nextInt(0, gameMap.column - 1);
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
  }
}
