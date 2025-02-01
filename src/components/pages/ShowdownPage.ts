import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";
import { Player, PlayerPair } from "../Player";
import { Card } from "../Card";

export class ShowdownPage extends Page {
	private competitors: PlayerPair[];
	private cards: Card[];

	constructor(scene: GameScene) {
		super(scene, GameState.Showdown);

		this.cards = [];
	}

	onActivate(): void {
		this.competitors = this.players.map((player) => player.pairings).flat();
		Phaser.Math.RND.shuffle(this.competitors);

		console.warn(this.competitors);

		if (this.competitors.length < 2) {
			this.scene.progressState();
		}

		this.battle(this.competitors[0], this.competitors[1]);
	}

	update(time: number, delta: number) {
		this.cards.forEach((card) => card.update(time, delta));
	}

	battle(first: PlayerPair, second: PlayerPair) {
		const card1 = new Card(
			this.scene,
			0.5 * this.scene.CX,
			this.scene.CY,
			first.imageId,
			first.textId
		);
		card1.setAngle(-5);
		this.add(card1);

		const card2 = new Card(
			this.scene,
			1.5 * this.scene.CX,
			this.scene.CY,
			second.imageId,
			second.textId
		);
		card2.setAngle(5);
		this.add(card2);

		card1.animate(500);
		card2.animate(3500);

		this.scene.addEvent(4000, () => {
			// Example of sending each player a list of every other players name
			this.players.forEach((player) => {
				// const options = this.players
				// 	.filter((p) => p.userId !== player.userId)
				// 	.map((p) => p.name);
				// Phaser.Math.RND.shuffle(options);

				const options = [first.id, second.id];

				this.socket.startVote(options, player.userId);
			});
		});
	}
}
