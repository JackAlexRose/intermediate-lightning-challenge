import { getRandomInt, saveNewHighscore } from "../utils";

export const Directions = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

export default class GameEngine {
  constructor(eatHandler) {
    this.gameLoop = this.gameLoop.bind(this);
    this._eatHandler = eatHandler;
  }

  gameLoop(currentTimestamp) {
    this.currentTime = currentTimestamp;
    this.deltaTime = Math.ceil(currentTimestamp - this.previousTime);
    this.update();
    this.previousTime = currentTimestamp;

    if (this.gameloopShouldContinue) {
      requestAnimationFrame(this.gameLoop);
    }
  }

  onUpdate(onUpdateHandler) {
    this.onUpdateHandler = onUpdateHandler;
  }

  onGameEnd(onGameEndHandler) {
    this.onGameEndHandler = onGameEndHandler;
  }

  enableGameLoop() {
    requestAnimationFrame(this.gameLoop);
  }

  disableGameLoop() {
    cancelAnimationFrame(this.gameLoop);
  }

  get gameObjects() {
    const score = this.snake.tail.length - 3;
    return {
      snake: this.snake,
      food: this.food,
      score: score < 0 ? 0 : score,
    };
  }

  setup() {
    this.previousTime = 0;
    this.snake = new Snake();
    this.food = new Food();
    this.timeSinceLastUpdate = 0;
    this.gameloopShouldContinue = true;
  }

  handle(direction) {
    this.snake.handle(direction);
  }

  updateTimeWindow = 200;
  timeSinceLastUpdate = 0;

  update() {
    this.timeSinceLastUpdate += this.deltaTime;
    if (this.timeSinceLastUpdate < this.updateTimeWindow) {
      return;
    }

    this.snake.update();

    const snakeHead = this.snake.tail[0];

    if (snakeHead.x === this.food.x && snakeHead.y === this.food.y) {
      this.snake.eat(this.food);
      this._eatHandler();
    }

    if (this.snake.isDead) {
      this.gameloopShouldContinue = false;
      let score = this.snake.tail.length - 3;
      score = score < 0 ? 0 : score;
      saveNewHighscore(score);
      this.onGameEndHandler();
      return;
    }

    if (this.onUpdateHandler) {
      this.onUpdateHandler();
    }

    this.timeSinceLastUpdate = 0;
  }
}

class Snake {
  color = "olive";

  constructor() {
    this.xSpeed = 1;
    this.ySpeed = 0;
    this._tail = [];

    this.tail.push(new Tail(2, 0));
    this.tail.push(new Tail(1, 0));
    this.tail.push(new Tail(0, 0));

    this.isDead = false;
  }

  get tail() {
    return this._tail;
  }

  set tail(tail) {
    this._tail = tail;
  }

  draw() {
    this.tail.forEach((tail) => {
      tail.draw();
    });
  }

  handle(direction) {
    if (!this.allowNextMove) return;

    if (direction === Directions.UP && this.ySpeed !== 1) {
      this.xSpeed = 0;
      this.ySpeed = -1;
      this.allowNextMove = false;
    }
    if (direction === Directions.DOWN && this.ySpeed !== -1) {
      this.xSpeed = 0;
      this.ySpeed = 1;
      this.allowNextMove = false;
    }
    if (direction === Directions.LEFT && this.xSpeed !== 1) {
      this.xSpeed = -1;
      this.ySpeed = 0;
      this.allowNextMove = false;
    }
    if (direction === Directions.RIGHT && this.xSpeed !== -1) {
      this.xSpeed = 1;
      this.ySpeed = 0;
      this.allowNextMove = false;
    }
  }

  get head() {
    return this.tail[0];
  }

  update() {
    this.allowNextMove = true;

    for (let i = this.tail.length - 1; i > 0; i--) {
      this.tail[i].x = this.tail[i - 1].x;
      this.tail[i].y = this.tail[i - 1].y;
    }

    this.head.x += this.xSpeed;
    this.head.y += this.ySpeed;

    const head = this.head;
    this.isDead = this.tail.some(
      (tail, index) => index !== 0 && head.x === tail.x && head.y === tail.y
    );
    this.isDead =
      this.isDead || head.x < 0 || head.x > 18 || head.y < 0 || head.y > 10;
  }

  eat(food) {
    this.tail.push(new Tail(food.x, food.y));
    food.pickNewLocation(this.head.x, this.head.y);
  }
}

class Tail {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Food {
  color = "orange";

  constructor() {
    this.x = 8;
    this.y = 0;
  }

  set x(x) {
    this._x = x;
  }

  get x() {
    return this._x;
  }

  set y(y) {
    this._y = y;
  }

  get y() {
    return this._y;
  }

  pickNewLocation(snakeX, snakeY) {
    let x = getRandomInt(18);
    let y = getRandomInt(10);

    while (snakeX === x && snakeY === y) {
      x = getRandomInt(18);
      y = getRandomInt(10);
    }

    this.x = x;
    this.y = y;
  }
}
