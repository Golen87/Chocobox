import { GameScene } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";
import { SocketManager } from "@/socket/SocketManager";

export class WritingPage extends Page {
	constructor(scene: GameScene) {
		super(scene, GameState.Writing);
	}

	onActivate(): void {
		this.socket.startTyping();
	}
}
