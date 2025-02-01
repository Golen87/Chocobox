import { GameScene } from "@/scenes/GameScene";
import { Color } from "@/utils/colors";

export class Card extends Phaser.GameObjects.Container {
	public scene: GameScene;

	private background: Phaser.GameObjects.Image;
	private image: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	constructor(
		scene: GameScene,
		x: number,
		y: number,
		imageId: string,
		textId: string
	) {
		super(scene, x, y);
		this.scene = scene;

		const top = new Phaser.Geom.Rectangle(-147, -271, 294, 294);
		const bottom = new Phaser.Geom.Rectangle(-160, 60, 320, 200);

		this.image = this.scene.add.image(top.centerX, top.centerY, imageId);
		this.image.setScale(top.width / this.image.width);
		this.add(this.image);

		this.background = this.scene.add.image(0, 0, "card");
		this.add(this.background);

		let size = 60;
		this.text = this.scene.addText({
			x: bottom.left,
			y: bottom.top,
			text: this.scene.getPlayerText(textId),
			size,
		});
		this.text.setWordWrapWidth(bottom.width);
		this.add(this.text);

		while (this.text.height > bottom.height) {
			this.text.setFontSize(size--);
		}
		this.text.setOrigin(0.5);
		this.text.x += this.text.width / 2;
		this.text.y += this.text.height / 2;

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

	animate(delay: number) {
		this.scene.tweens.add({
			targets: this.background,
			scale: this.background.scaleX,
			alpha: 1,
			duration: 200,
			delay: delay + 0,
			ease: "back.out",
		});
		this.scene.tweens.add({
			targets: this.image,
			scale: this.image.scaleX,
			alpha: 1,
			duration: 200,
			delay: delay + 500,
			ease: "back.out",
		});
		this.scene.tweens.add({
			targets: this.text,
			scale: this.text.scaleX,
			alpha: 1,
			duration: 200,
			delay: delay + 1500,
			ease: "back.out",
		});

		this.background.setScale(0.5).setAlpha(0);
		this.image.setScale(0.5).setAlpha(0);
		this.text.setScale(0.5).setAlpha(0);
	}
}
