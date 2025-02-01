import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";
import { Card } from "../Card";

export class WinnerPage extends Page {
	constructor(scene: GameScene) {
		super(scene, GameState.Winner);
	}

	onActivate(): void {
		this.socket.setBlank();

		const mashups = this.players.map((player) => player.pairings).flat();
		const winner = mashups.reduce((a, b) => (a.votes > b.votes ? a : b));

		const card = new Card(
			this.scene,
			this.scene.CX,
			this.scene.CY,
			winner.imageId,
			winner.textId
		);
		this.add(card);

		card.animate(500);
	}
}
