<template>
  <div class="game-container">
    <div class="game-left">
      <div
        class="main-frame"
        :style="{
          '--cell-gap': mainFrame.cellGap + 'px',
        }"
      >
        <div v-for="(item, index) in mainFrame.cells" :key="index" class="row">
          <div
            v-for="(it, id) in item"
            :key="id"
            class="cell"
            :style="{
              background: it.bgColor,
              '--cell-size': it.size + 'px',
            }"
          ></div>
          <div v-if="snake.isDead" class="game-over">Game Over</div>
        </div>
      </div>
      <div class="operation-box">
        <div class="btn move-up" @click="snake.turnUp()">向上</div>
        <div class="btn" @click="snake.turnLeft()">向左</div>
        <div class="btn" @click="snake.turnRight()">向右</div>
        <div class="btn move-down" @click="snake.turnDown()">向下</div>
      </div>
    </div>
    <div class="game-right">
      <div class="data-box">
        <div class="data-row">
          <div class="data-label">已吃食物:</div>
          <div class="data">{{ gameRecorder.eated }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">等级:</div>
          <div class="data">{{ gameRecorder.level }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">分数:</div>
          <div class="data">{{ gameRecorder.score }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">速度:</div>
          <div class="data">{{ snake.moveSpeed }}</div>
        </div>
        <div class="data-row">
          <div class="data-label">历史记录:</div>
          <div class="data">{{ gameRecorder.record }}</div>
        </div>
      </div>
      <div class="system-box">
        <div
          class="btn"
          @click="gameController.pauseGame"
          v-if="gameController.isGameRunning"
        >
          暂停
        </div>
        <div
          class="btn"
          @click="gameController.pauseGame"
          v-else="!gameController.isGameRunning"
        >
          继续
        </div>
        <div class="btn" @click="gameController.resetGame">重新开始</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, onBeforeUnmount } from "vue";
import GameMap from "@/class/game/gameMap";
import Food from "@/class/game/food";
import Snake from "@/class/game/snake";
import GameController from "@/class/game/gameController";
import GameRecorder from "@/class/game/gameRecorder";
const mainFrame = reactive(new GameMap(20, 10, 20, 1, "#eee"));
const gameRecorder = reactive(new GameRecorder());
const snake = reactive(
  new Snake(gameRecorder, mainFrame, "yellow", "green", 500)
);
mainFrame.addSnake(snake);
const food = reactive(new Food(mainFrame, "red", 1));
mainFrame.addFood(food);
mainFrame.renderSnake();
mainFrame.renderFood();
const gameController = reactive(new GameController(gameRecorder, mainFrame));
gameController.autoMoveSnake();

onMounted(() => {
  window.addEventListener("keydown", gameController.listenKeyboard());
  watch(
    () => snake.isDead,
    (newValue) => {
      if (newValue) {
        gameRecorder.mayBreakRecord();
      }
    }
  );
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", gameController.listenKeyboard());
});
</script>

<style lang="less" scoped>
.game-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background: #fff;

  --operation-box-width: 150px;
  --btn-height: 60px;
  --btn-border-radius: 5px;
  --game-over-font-size: 30px;
  --data-font-size: 16px;

  .game-left {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    .main-frame {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: var(--cell-gap);
      border: 1px solid #ccc;
      .row {
        display: flex;
        flex-direction: row;
        gap: var(--cell-gap);
      }
      .cell {
        width: var(--cell-size);
        height: var(--cell-size);
      }
      .game-over {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        color: limegreen;
        font-size: var(--game-over-font-size);
        line-height: var(--game-over-font-size);
        font-weight: bold;
        font-family: Consolas;
        text-align: center;
      }
    }
    .operation-box {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px 10px;
      .btn {
        height: var(--btn-height);
        background: rgba(72, 72, 213, 0.6);
        border-radius: var(--btn-border-radius);
        line-height: var(--btn-height);
        text-align: center;
        color: #fff;
        cursor: pointer;
      }
      .move-up,
      .move-down {
        grid-column: 1/3;
        border-radius: calc(var(--btn-border-radius) * 2);
      }
    }
  }

  .game-right {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
    .data-box {
      .data-row {
        display: flex;
        gap: 10px;
        .data-label {
          font-size: var(--data-font-size);
        }
        .data {
          font-size: var(--data-font-size);
          font-weight: 700;
          color: #00aaee;
        }
      }
    }
    .system-box {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 5px;
      .btn {
        width: 100px;
        background: rgba(246, 214, 11, 0.8);
        border-radius: var(--btn-border-radius);
        line-height: 50px;
        text-align: center;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
