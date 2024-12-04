import { BaseScene } from "@/scenes/BaseScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";
import { ColorStr } from "@/utils/colors";

export class LobbyPage extends Page {
	private code: Phaser.GameObjects.Text;

	constructor(scene: BaseScene) {
		super(scene, GameState.Lobby);

		let instruction = scene
			.addText({
				x: 410,
				y: 600,
				size: 34,
				text: "Join on your phone at",
			})
			.setOrigin(0.5)
			.setStroke("black", 10);
		this.add(instruction);

		let url = scene
			.addText({
				x: 410,
				y: 670,
				size: 55,
				text: "chocobois.web.app",
				color: ColorStr.Amber400,
			})
			.setOrigin(0.5)
			.setStroke("black", 14);
		this.add(url);

		this.code = scene
			.addText({ x: 410, y: 845, size: 128 })
			.setOrigin(0.5)
			.setStroke("black", 16);
		this.add(this.code);

		for (let i = 0; i < 8; i++) {
			let x = 1250 + 380 * Math.floor(i / 4);
			let y = 165 + 250 * (i % 4);
			let frame = (i + Math.floor(i / 4)) % 2;
			let playerBox = new PlayerBox(scene, x, y, frame);
			this.add(playerBox);
		}
	}

	setCode(code: string): void {
		this.code.setText(code);
	}
}

class PlayerBox extends Phaser.GameObjects.Container {
	private box: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	constructor(scene: BaseScene, x: number, y: number, startFrame: number) {
		super(scene, x, y);

		let frame = startFrame;
		this.box = scene.add.image(0, 0, "user_box", frame);
		this.add(this.box);

		this.text = scene.addText({ x: 0, y: 0, size: 48 }).setOrigin(0.5);
		this.add(this.text);

		this.scene.time.addEvent({
			delay: 500,
			loop: true,
			callback: () => {
				frame = 1 - frame;
				this.box.setFrame(frame);
			},
		});

		this.setPlayer(null);
	}

	setPlayer(name: string | null) {
		this.box.setAlpha(name ? 1 : 0.25);
		this.text.setAlpha(name ? 1 : 0.25);
		this.text.setText(name || "Join");
	}
}
