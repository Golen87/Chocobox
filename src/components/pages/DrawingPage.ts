import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";
import { Player } from "../Player";

export class DrawingPage extends Page {
	public round: number;
	private playerIcons: PlayerIcon[];

	constructor(scene: GameScene) {
		super(scene, GameState.Drawing);

		this.round = 1;
		this.playerIcons = [];
	}

	onActivate(): void {
		this.socket.startDrawing();
	}

	updatePlayers(players: Player[]): void {
		while (players.length > this.playerIcons.length) {
			const player = players[this.playerIcons.length];
			const icon = new PlayerIcon(this.scene, player);

			this.playerIcons.push(icon);
			this.add(icon);
		}
	}

	allPlayersDone(): void {
		this.scene.addEvent(1000, () => {
			this.scene.progressState();
		});
	}

	update(time: number, delta: number) {
		this.playerIcons.forEach((preview) => preview.update(time, delta));
	}
}

class PlayerIcon extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: Phaser.GameObjects.Image;
	private image: Phaser.GameObjects.Image;
	private playerName: Phaser.GameObjects.Text;
	private badge: Badge;

	constructor(scene: GameScene, player: Player) {
		super(scene);
		this.scene = scene;

		this.add((this.image = scene.add.image(0, 0, "player")));

		this.add(
			(this.playerName = scene
				.addText({
					x: 0,
					y: 0,
					size: 48,
					text: player.name,
				})
				.setOrigin(0.5))
		);

		this.add((this.badge = new Badge(scene)));

		let frame = 0;
		this.scene.time.addEvent({
			delay: 500,
			loop: true,
			callback: () => {
				frame = 1 - frame;
				this.background.setFrame(frame);
			},
		});
	}

	update(time: number, delta: number) {}
}

class Badge extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: Phaser.GameObjects.Arc;
	private text: Phaser.GameObjects.Text;

	constructor(scene: GameScene) {
		super(scene);
		this.scene = scene;

		this.add((this.background = scene.add.circle(0, 0, 50, 0x000000, 0.5)));

		this.add(
			(this.text = scene
				.addText({
					x: 0,
					y: 0,
					size: 48,
					text: "0",
				})
				.setOrigin(0.5))
		);
	}

	update(time: number, delta: number) {}

	setText(text: string) {
		this.text.setText(text);
	}

	setHighlight(highlight: boolean) {
		this.background.setFillStyle(highlight ? 0xffffff : 0x000000, 0.5);
	}
}
