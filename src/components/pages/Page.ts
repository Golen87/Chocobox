import { GameScene } from "@/scenes/GameScene";
import { GameState } from "@/utils/GameState";
import { Player } from "../Player";

export class Page extends Phaser.GameObjects.Container {
	public scene: GameScene;
	public gameState: GameState;

	private background: Phaser.GameObjects.Image;

	constructor(scene: GameScene, gameState: GameState) {
		super(scene, 0, 0);
		scene.add.existing(this);
		this.scene = scene;
		this.gameState = gameState;

		let frame = 0;
		this.background = scene.add.image(0, 0, `${gameState}_${frame + 1}`);
		this.background.setOrigin(0);
		scene.fitToScreen(this.background);
		this.add(this.background);

		this.scene.time.addEvent({
			delay: 500,
			loop: true,
			callback: () => {
				frame = 1 - frame;
				this.background.setTexture(`${this.gameState}_${frame + 1}`);
			},
		});
	}

	update(time: number, delta: number): void {
		// Implement in subclass
	}

	updatePlayers(): void {
		// Implement in subclass
	}

	setVisible(value: boolean): this {
		if (this.visible == value) return this;
		if (value) this.onActivate();
		return super.setVisible(value);
	}

	onActivate() {
		// Implement in subclass
	}

	get socket() {
		return this.scene.getSocket();
	}

	get players() {
		return this.scene.getPlayers();
	}
}
