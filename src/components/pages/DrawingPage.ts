import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";

export class DrawingPage extends Page {
	constructor(scene: GameScene) {
		super(scene, GameState.Drawing);
	}

	onActivate(): void {
		this.socket.startDrawing();
	}
}
