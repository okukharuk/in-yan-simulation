import * as PIXI from "pixi.js";
import { TTeam, TeamColor } from "../types/team";

export class Score {
  home: number = 128;
  guest: number = 128;

  home_text: PIXI.Text;
  guest_text: PIXI.Text;

  score: PIXI.Container;

  constructor() {
    const homeStyle = new PIXI.TextStyle({
      fill: TeamColor.home,
      fontSize: 36,
    });
    const guestStyle = new PIXI.TextStyle({
      fill: TeamColor.guest,
      fontSize: 36,
    });
    const xStyle = new PIXI.TextStyle({
      fill: "#cdcbcd",
      fontSize: 36,
    });

    this.home_text = new PIXI.Text(this.home, homeStyle);
    const x = new PIXI.Text("x", xStyle);
    x.x = 72;

    this.guest_text = new PIXI.Text(this.guest, guestStyle);
    this.guest_text.x = 100;

    this.score = new PIXI.Container();
    this.score.y = 1024;
    this.score.addChild(this.home_text);
    this.score.addChild(x);
    this.score.addChild(this.guest_text);
  }

  addScore(team: TTeam) {
    team === "home" ? (this.home++, this.guest--) : (this.guest++, this.home--);
    this.updateScore();
  }

  updateScore() {
    this.home_text.text = this.home;
    this.guest_text.text = this.guest;
  }
}
