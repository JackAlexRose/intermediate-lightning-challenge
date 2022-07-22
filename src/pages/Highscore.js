import { Lightning, Colors, Router } from "@lightningjs/sdk";
import Button from "../components/Button";
import fontStyles from "../lib/fontStyles";
import styles from "../lib/styles";
import { clearHighscores, getHighscores } from "../utils";

class Highscore extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      color: Colors("black").get(),
      rect: true,

      Highscores: {
        w: 1920,
        h: 540,
        y: 0,

        Title: {
          y: styles.spacing.large + styles.spacing.medium,
          x: 960,
          mountX: 0.5,

          text: {
            text: "| Highscores |",
            ...fontStyles.title,
            textColor: Colors("green").get(),
          },
        },

        HighscoreItems: {
          y: styles.spacing.large * 3 + styles.spacing.medium,
          x: 960,
          mountX: 0.5,
          flex: {
            direction: "column",
            alignItems: "center",
          },
        },
      },

      Buttons: {
        w: 1920,
        h: 540,
        y: 1080 - 540 - styles.spacing.medium,
        x: 0,

        flex: {
          direction: "column",
          justifyContent: "center",
          alignItems: "center",
        },

        PlayAgain: {
          type: Button,
          title: "Play Again",
          signals: {
            buttonPressed: "_playAgainSignal",
          },
        },

        GoBackHome: {
          type: Button,
          flexItem: {
            marginTop: styles.spacing.medium,
          },
          title: "Home",
          signals: {
            buttonPressed: "_goBackHomeSignal",
          },
        },

        ClearHighscores: {
          type: Button,
          flexItem: {
            marginTop: styles.spacing.medium,
          },
          title: "Clear Highscores",
          signals: {
            buttonPressed: "_clearHighscoresSignal",
          },
        },
      },
    };
  }

  index = 0;

  _handleDown() {
    this.index++;

    if (this.index >= this.tag("Buttons").children.length) {
      this.index = this.tag("Buttons").children.length - 1;
    }
  }

  _handleUp() {
    this.index--;

    if (this.index <= 0) {
      this.index = 0;
    }
  }

  _getFocused() {
    return this.tag("Buttons").children[this.index];
  }

  _active() {
    this._renderHighscores();
  }

  _renderHighscores() {
    const highscores = getHighscores();

    this.tag("HighscoreItems").children = highscores.map((highscore, index) => {
      return {
        text: {
          text: `${index + 1}. ${highscore.date} - ${highscore.score}`,
          ...fontStyles.menuItem,
          textColor: Colors("white").get(),
        },
      };
    });
  }

  clearScores() {
    clearHighscores();
    this._renderHighscores();
  }

  _playAgainSignal() {
    Router.navigate("game");
  }

  _goBackHomeSignal() {
    Router.navigate("mainMenu");
  }

  _clearHighscoresSignal() {
    this.clearScores();
  }
}

export default Highscore;
