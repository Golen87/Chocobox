import { BaseScene } from "@/scenes/BaseScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";

export class PairingPage extends Page {
	constructor(scene: BaseScene) {
		super(scene, GameState.Pairing);
	}
}
