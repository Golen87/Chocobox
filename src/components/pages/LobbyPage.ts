import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";
import { ColorStr } from "@/utils/colors";
import { Player } from "../Player";

export class LobbyPage extends Page {
	private code: Phaser.GameObjects.Text;
	private playerBoxes: PlayerBox[];

	constructor(scene: GameScene) {
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

		this.playerBoxes = [];
		for (let i = 0; i < 8; i++) {
			let x = 1250 + 380 * Math.floor(i / 4);
			let y = 165 + 250 * (i % 4);
			let frame = (i + Math.floor(i / 4)) % 2;
			let playerBox = new PlayerBox(scene, x, y, frame);
			this.playerBoxes.push(playerBox);
			this.add(playerBox);
		}
	}

	setCode(code: string): void {
		this.code.setText(code);
	}

	updatePlayers(players: Player[]): void {
		const boxPlayers = this.playerBoxes.map((box) => box.player);
		const addedPlayers = players.filter(
			(player) => !boxPlayers.includes(player)
		);

		this.playerBoxes.forEach((box, i) => {
			if (box.player == null) {
				box.setPlayer(addedPlayers.shift() || null);
			} else if (!players.includes(box.player)) {
				box.setPlayer(null);
			}
		});
	}
}

class PlayerBox extends Phaser.GameObjects.Container {
	public player: Player | null;

	private box: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	constructor(scene: GameScene, x: number, y: number, startFrame: number) {
		super(scene, x, y);
		this.player = null;

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

	setPlayer(player: Player | null) {
		this.player = player;
		if (player) {
			this.box.setAlpha(1);
			this.text.setAlpha(1);
			this.text.setText(player.name);
		} else {
			this.box.setAlpha(0.25);
			this.text.setAlpha(0.25);
			this.text.setText("Join");
		}
	}
}
