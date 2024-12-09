import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";

export class TitlePage extends Page {
	private mato: Phaser.GameObjects.Image;

	constructor(scene: GameScene) {
		super(scene, GameState.Title);

		const sounds = [
			"anger",
			"bonk",
			"boom",
			"bruh",
			"bup",
			"crab",
			"disc",
			"dog",
			"e",
			"gaster",
			"gnome",
			"gun",
			"mariopaint_baby",
			"mariopaint_cat",
			"mariopaint_dog",
			"necoarc",
			"oof",
			"pizza",
			"smw_1up",
			"smw_spinjump",
			"smw_stomp",
			"smw_yoshi",
			"swan",
			"thwomp",
			"whatsapp",
			"yoda",
		];

		sounds.forEach((sound) => {
			// const button = this.scene.add
			// 	.rectangle(0, 0, 150, 50, 0x6666ff)
			// 	.setInteractive();
			// const buttonText = this.scene.add.text(0, 0, sound, {
			// 	fontSize: "16px",
			// 	color: "#ffffff",
			// });
			// Phaser.Display.Align.In.Center(buttonText, button);
			// button.on("pointerdown", () => {
			// 	this.scene.sound.play(sound, { volume: 0.5 });
			// });
			// const col = sounds.indexOf(sound) % 10;
			// const row = Math.floor(sounds.indexOf(sound) / 10);
			// button.setPosition(100 + col * 160, 100 + row * 60);
			// buttonText.setPosition(
			// 	button.x - buttonText.width / 2,
			// 	button.y - buttonText.height / 2
			// );
		});
	}
}
