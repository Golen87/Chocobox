import { GameScene } from "@/scenes/GameScene";

const ACCELERATION = 150;
const MAX_SPEED = 400;
const FRICTION = 0.7;
console.assert(
	ACCELERATION / (1 - FRICTION) >= MAX_SPEED,
	"Max speed unreachable"
);

export class Player extends Phaser.GameObjects.Container {
	public scene: GameScene;

	// Sprites
	private spriteSize: number;
	private sprite: Phaser.GameObjects.Sprite;

	// Controls
	public inputVec: Phaser.Math.Vector2; // Just used for keyboard -> vector
	public velocity: Phaser.Math.Vector2;
	private border: { [key: string]: number };

	constructor(scene: GameScene, x: number, y: number) {
		super(scene, x, y);
		scene.add.existing(this);
		this.scene = scene;

		/* Sprite */
		this.spriteSize = 200;
		this.sprite = this.scene.add.sprite(0, 0, "player");
		this.sprite.setOrigin(0.5, 1.0);
		this.sprite.y += this.spriteSize / 2;
		this.sprite.setScale(this.spriteSize / this.sprite.width);
		this.add(this.sprite);

		/* Controls */
		this.inputVec = new Phaser.Math.Vector2(0, 0);
		this.velocity = new Phaser.Math.Vector2(0, 0);
		this.border = {
			left: 100,
			right: scene.W - 100,
			top: 100,
			bottom: scene.H - 100,
		};
	}

	update(time: number, delta: number) {
		this.inputVec.limit(1);
		this.inputVec.scale(ACCELERATION);

		this.velocity.scale(FRICTION);
		this.velocity.add(this.inputVec);
		this.velocity.limit(MAX_SPEED);

		this.x += (this.velocity.x * delta) / 1000;
		this.y += (this.velocity.y * delta) / 1000;

		// Border collision
		if (this.x < this.border.left) {
			this.x = this.border.left;
		}
		if (this.x > this.border.right) {
			this.x = this.border.right;
		}
		if (this.y < this.border.top) {
			this.y = this.border.top;
		}
		if (this.y > this.border.bottom) {
			this.y = this.border.bottom;
		}

		// Animation (Change to this.sprite.setScale if needed)
		const squish = 1.0 + 0.02 * Math.sin((6 * time) / 1000);
		this.setScale(1.0, squish);
	}
}
