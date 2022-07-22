import { Lightning, Utils, Colors, Router } from "@lightningjs/sdk";
import Button from "../components/Button";
import fontStyles from "../lib/fontStyles";
import styles from "../lib/styles";

class MainMenu extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 1080,
      color: Colors("black").get(),
      rect: true,

      Logo: {
        w: (w) => w,
        h: (h) => h * 0.6,

        flex: {
          direction: "column",
          justifyContent: "center",
          alignItems: "center",
        },

        Icon: {
          w: 200,
          h: 130,

          texture: {
            type: Lightning.textures.ImageTexture,
            src: Utils.asset("images/snake.png"),
          },
        },

        Title: {
          text: {
            ...fontStyles.title,
            text: "Snake",
            textColor: Colors("green").get(),
            textAlign: "center",
          },
        },
      },

      Items: {
        w: (w) => w,
        h: (h) => h,
        y: (h) => h * 0.15,

        flex: {
          direction: "column",
          justifyContent: "center",
          alignItems: "center",
        },

        PlayItem: {
          type: Button,
          title: "Play",
          signals: {
            buttonPressed: "_playItemSignal",
          },
        },

        HighscoreItem: {
          type: Button,
          title: "Highscore",
          flexItem: {
            marginTop: styles.spacing.medium,
          },
          signals: {
            buttonPressed: "_highscoreItemSignal",
          },
        },
      },
    };
  }

  _index = 0;

  _getFocused() {
    return this.tag("Items").children[this._index];
  }

  _handleDown() {
    this._index = 1;
  }

  _handleUp() {
    this._index = 0;
  }

  _playItemSignal() {
    Router.navigate("game");
  }

  _highscoreItemSignal() {
    Router.navigate("highscore");
  }
}

export default MainMenu;