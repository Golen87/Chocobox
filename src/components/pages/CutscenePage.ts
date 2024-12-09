import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";

export class CutscenePage extends Page {
	constructor(scene: GameScene) {
		super(scene, GameState.Cutscene);
	}

	onActivate(): void {
		this.socket.setBlank();
	}
}
