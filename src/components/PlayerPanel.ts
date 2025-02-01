import { GameScene } from "@/scenes/GameScene";
import { PlayerIcon } from "./pages/PlayerIcon";
import { Player } from "./Player";

export class PlayerPanel extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private playerIcons: PlayerIcon[];

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;
		scene.add.existing(this);

		this.playerIcons = [];
	}

	update(time: number, delta: number) {
		this.playerIcons.forEach((preview) => preview.update(time, delta));
	}

	updatePlayers(players: Player[]): void {
		// Add new player
		while (players.length > this.playerIcons.length) {
			const player = players[this.playerIcons.length];
			const icon = new PlayerIcon(this.scene, player);

			this.playerIcons.push(icon);
			this.add(icon);
		}

		// Position player icons
		const width = 350;
		const left = -((players.length - 1) / 2) * width;
		this.playerIcons.forEach((icon, index) => {
			icon.setPosition(left + index * width, 0);
		});
		const scale = (this.scene.W - 200) / Math.abs(2 * left - width);
		this.setScale(Math.min(1, scale));
	}

	updateCount(counts: number[], maxCount: number) {
		// Update player icons
		this.playerIcons.forEach((icon, index) => {
			icon.setCount(counts[index], maxCount);
		});
	}
}
