import { TTeam, TeamColor, TeamCoord } from "../types/team";
import { Square } from "./Square";
import * as PIXI from "pixi.js";

export class Player extends Square {
  speed: number;
  collisionSquares: Square[][];
  direction: { x: number; y: number };
  ticker: PIXI.Ticker;
  collisionCallback: () => void;

  constructor(team: TTeam, sprite: PIXI.Graphics, collisionSquares: Square[][], collisionCallback: () => void) {
    super(team, sprite);
    this.speed = 16;

    this.collisionSquares = collisionSquares;
    this.collisionCallback = collisionCallback;

    this.direction = {
      x: Math.random() > 0.5 ? -1 : 1,
      y: Math.random() > 0.5 ? -0.5 : 0.5,
    };

    this.sprite.width = 64;
    this.sprite.height = 64;

    this.sprite.x = 512 * TeamCoord[team];
    this.sprite.y = 128 + Math.round(Math.random() * 640);

    this.sprite.beginFill(TeamColor[team === "home" ? "guest" : "home"]);
    this.sprite.drawRect(0, 0, 64, 64);
    this.sprite.endFill();

    this.ticker = new PIXI.Ticker();
    this.ticker.maxFPS = 60;
    this.ticker.start();
    this.ticker.add(() => {
      this.#handleBorderCollision();
      this.#handleSquareCollision();
      this.#move();
    });
  }

  #move() {
    if (this.sprite.x >= 0 || this.sprite.x <= 1024 - 64) this.sprite.x += this.speed * this.direction.x;
    if (this.sprite.y >= 0 || this.sprite.y <= 1024 - 64) this.sprite.y += this.speed * this.direction.y;
  }

  #handleBorderCollision() {
    if (this.sprite.x >= 1024 - 64 || this.sprite.x <= 0)
      (this.direction.x *= -1), (this.sprite.x = this.sprite.x > 0 ? 1024 - 64 : 0);
    if (this.sprite.y >= 1024 - 64 || this.sprite.y <= 0)
      (this.direction.y *= -1), (this.sprite.y = this.sprite.y > 0 ? 1024 - 64 : 0);
  }

  #handleSquareCollision() {
    this.collisionSquares.forEach((squares) =>
      squares.every((square) => {
        if (this.team === square.team) return true;

        const playerBounds = this.sprite.getBounds();
        const squareBounds = square.sprite.getBounds();

        playerBounds.width += this.speed * this.direction.x;
        playerBounds.height += this.speed * this.direction.y;

        squareBounds.width += this.speed * -this.direction.x;
        squareBounds.height += this.speed * -this.direction.y;

        const intersects = playerBounds.intersects(squareBounds);
        if (!intersects) return true;

        square.reverseTeam();

        const { x: PX, y: PY } = this.sprite;
        const { x: SX, y: SY } = square.sprite;

        const differenceX = Math.abs(PX - SX);
        const differenceY = Math.abs(PY - SY);

        if (differenceX <= differenceY) this.direction.y *= -1;
        if (differenceX > differenceY) this.direction.x *= -1;

        this.collisionCallback();

        return false;
      })
    );
  }
}
