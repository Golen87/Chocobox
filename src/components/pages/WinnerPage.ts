import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";

export class WinnerPage extends Page {
	constructor(scene: GameScene) {
		super(scene, GameState.Winner);
	}

	onActivate(): void {
		this.socket.setBlank();
	}
}
