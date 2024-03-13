import * as PIXI from "pixi.js";
import { TeamColor } from "./types/team";
import { Square } from "./models/Square";
import { Score } from "./models/Score";
import { Player } from "./models/Player";

const app = new PIXI.Application<HTMLCanvasElement>({
  width: 1024,
  height: 1080,
  backgroundAlpha: 0,
});

const startGame = () => {
  let field: Square[][] = [...new Array(16)].map((item) => new Array(16).fill(""));
  const scene = new PIXI.Container();

  scene.width = 1024;
  scene.height = 1024;

  const generateField = () => {
    field = field.map((item, indexX) =>
      item.map((item, indexY) => {
        const square = new PIXI.Graphics();
        const team = indexX < field.length / 2 ? "home" : "guest";

        square.width = 64;
        square.height = 64;

        square.x = indexX * 64;
        square.y = indexY * 64;

        square.beginFill(TeamColor[team]);
        square.drawRect(0, 0, 64, 64);
        square.endFill();

        scene.addChild(square);

        return new Square(team, square);
      })
    );
  };

  generateField();

  const score = new Score();

  const homePlayer = new Player("home", new PIXI.Graphics(), field, () => score.addScore("home"));
  const guestPlayer = new Player("guest", new PIXI.Graphics(), field, () => score.addScore("guest"));

  scene.addChild(homePlayer.sprite);
  scene.addChild(guestPlayer.sprite);

  app.stage.addChild(scene);

  app.stage.addChild(score.score);
};

startGame();

document.body.appendChild(app.view);
