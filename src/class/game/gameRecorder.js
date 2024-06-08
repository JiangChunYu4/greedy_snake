export default class GameRecorder {
  score;
  level;
  eated;
  record;

  constructor() {
    this.score = 0;
    this.level = 1;
    this.eated = 0;
    this.loadRecord();
  }

  addScore(score) {
    this.score += score;
  }

  addEated() {
    this.eated++;
    this.mayIncreaseLevel();
  }

  mayIncreaseLevel() {
    if (this.eated % 5 === 0) {
      this.level++;
    }
  }

  nextScore() {
    return (this.eated * (this.eated + 1)) / 2 * this.level;
  }

  mayBreakRecord() {
    if (this.score > this.record) {
      this.record = this.score;
      localStorage.setItem("record", this.record);
    }
  }

  loadRecord() {
    const r = localStorage.getItem("record");
    if (r) {
      this.record = parseFloat(r);
    } else {
      this.record = 0;
    }
  }

  reset() {
    this.score = 0;
    this.level = 1;
    this.eated = 0;
  }
}
