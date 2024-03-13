import * as PIXI from "pixi.js";
import { TTeam, TeamColor } from "../types/team";

export class Square {
  team: TTeam;
  sprite: PIXI.Graphics;

  constructor(team: TTeam, sprite: PIXI.Graphics) {
    this.team = team;
    this.sprite = sprite;
  }

  reverseTeam() {
    this.team = this.team === "home" ? "guest" : "home";
    this.sprite.beginFill(TeamColor[this.team]);
    this.sprite.drawRect(0, 0, 64, 64);
    this.sprite.endFill();
  }
}
