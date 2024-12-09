import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";

export class PairingPage extends Page {
	constructor(scene: GameScene) {
		super(scene, GameState.Pairing);
	}

	onActivate(): void {
		const images: { id: string; base64: string }[] = [
			{ id: "1", base64: "image1" },
			{ id: "2", base64: "image2" },
			{ id: "3", base64: "image3" },
			{ id: "4", base64: "image4" },
		];
		const texts: { id: string; text: string }[] = [
			{ id: "1", text: "text1" },
			{ id: "2", text: "text2" },
			{ id: "3", text: "text3" },
			{ id: "4", text: "text4" },
		];
		this.socket.startMashup(images, texts);
	}
}
