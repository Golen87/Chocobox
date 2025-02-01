import { GameScene } from "@/scenes/GameScene";
import { PlayerBadge } from "../PlayerBadge";
import { Player } from "../Player";

export class PlayerIcon extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: Phaser.GameObjects.Image;
	private playerName: Phaser.GameObjects.Text;
	private badge: PlayerBadge;

	constructor(scene: GameScene, player: Player) {
		super(scene);
		this.scene = scene;

		this.add((this.background = scene.add.image(0, 0, "user_box")));

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

		this.add((this.badge = new PlayerBadge(scene, -120, -80)));

		let frame = 0;
		this.scene.time.addEvent({
			delay: 500,
			loop: true,
			callback: () => {
				frame = 1 - frame;
				this.background.setFrame(frame);
			},
		});

		this.setCount(0, 1);
	}

	update(time: number, delta: number) {}

	setPlayer(player: Player) {
		this.playerName.setText(player.name);
	}

	setCount(count: number, maxCount: number) {
		this.badge.setCount(count, maxCount);
	}
}
