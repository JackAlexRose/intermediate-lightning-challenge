import { Lightning, Colors, Router } from "@lightningjs/sdk";
import fontStyles from "../lib/fontStyles";
import GameEngine, { Directions } from "../lib/game";
import styles from "../lib/styles";

class Game extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      color: Colors("black").get(),
      rect: true,

      GameItems: {
        w: 1920,
        h: 1080,
      },

      Score: {
        x: (w) => w - styles.spacing.large,
        y: styles.spacing.medium,

        mountX: 1,
        text: {
          ...fontStyles.title,
          text: "Score: 0",
          textAlign: "right",
        },
      },
    };
  }

  cellSize = 100;
  tailItemPadding = 10;
  itemSize = 80;

  renderGame() {
    const { snake, food, score } = this.game.gameObjects;
    const children = [];

    snake.tail.forEach((tail) => {
      children.push({
        x: tail.x * this.cellSize + this.tailItemPadding,
        y: tail.y * this.cellSize + this.tailItemPadding,
        w: this.itemSize,
        h: this.itemSize,

        rect: true,
        color: Colors(snake.color).get(),
      });
    });

    children.push({
      Food: {
      x: food.x * this.cellSize + this.tailItemPadding,
      y: food.y * this.cellSize + this.tailItemPadding,
      w: this.itemSize,
      h: this.itemSize,

      rect: true,
      color: Colors(food.color).get(),
      shader: {
        type: Lightning.shaders.Perspective, 
        rx: 0,
      }
    }
    });

    this.tag("GameItems").children = children;

    this.tag("Score").text = `Score: ${score}`;
  }

  gameEndHandler() {
    this.game = null;
    Router.navigate("highscore");
  }

  // Hint: Use this method to start the game
  startGame() {
    this.game = new GameEngine();
    this.game.setup();
    this.renderGame = this.renderGame.bind(this);
    this.gameEndHandler = this.gameEndHandler.bind(this);
    this.game.onUpdate(this.renderGame);
    this.game.onGameEnd(this.gameEndHandler);
    this.game.enableGameLoop();
    this._animationDemo.start();
  }

  // Hint: Use this method to stop the game
  endGame() {
    if (this.game) {
      this.game.disableGameLoop();
      this.game = null;
      this._animationDemo.stop();
    }
  }

  _init() {
    const rotate90 = Math.PI * 0.5;

    this._animationDemo = this.animation({duration: 2, repeat: -1, actions: [
      {t: 'Food' ,p: 'shader.rx', v: {0: 0, 0.25: rotate90, 0.5: rotate90 * 2, 0.75: rotate90 * 3, 1: rotate90 * 4}},
  ]});
  }

  _active() {
    this.startGame();
  }

  _inactive() {
    this.endGame();
  }

  _handleUp() {
    this.game.handle(Directions.UP);
  }

  _handleDown() {
    this.game.handle(Directions.DOWN);
  }

  _handleLeft() {
    this.game.handle(Directions.LEFT);
  }

  _handleRight() {
    this.game.handle(Directions.RIGHT);
  }
}

export default Game;
