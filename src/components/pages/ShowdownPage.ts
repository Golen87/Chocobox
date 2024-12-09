import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";
import { Player } from "../Player";

export class ShowdownPage extends Page {
	private players: Player[];

	constructor(scene: GameScene) {
		super(scene, GameState.Showdown);
	}

	onActivate(): void {
		// Example of sending each player a list of every other players name
		this.players.forEach((player) => {
			const options = this.players
				.filter((p) => p.userId !== player.userId)
				.map((p) => p.name);
			Phaser.Math.RND.shuffle(options);

			this.socket.startVote(options, player.userId);
		});
	}

	updatePlayers(players: Player[]): void {
		this.players = players;
	}
}
