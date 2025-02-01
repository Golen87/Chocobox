import { GameScene } from "@/scenes/GameScene";
import { Color } from "@/utils/colors";

export class PlayerBadge extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: Phaser.GameObjects.Arc;
	private text: Phaser.GameObjects.Text;

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		this.scene = scene;

		this.add((this.background = scene.add.circle(0, 0, 40, 0)));

		this.add(
			(this.text = scene
				.addText({
					x: 0,
					y: 0,
					size: 48,
				})
				.setOrigin(0.5))
		);

		this.setCount(0);
	}

	update(time: number, delta: number) {}

	setCount(count: number, max: number = 1) {
		this.text.setText(count.toString());
		this.background.fillColor = count < max ? Color.Slate900 : Color.Rose700;
	}
}
