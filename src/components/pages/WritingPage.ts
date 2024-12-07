import { BaseScene } from "@/scenes/BaseScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";

export class WritingPage extends Page {
	constructor(scene: BaseScene) {
		super(scene, GameState.Writing);
	}

	onActivate(): void {
		this.emit("mode", "typing");
	}
}
