import { GameScene, MAX_IMAGES, MAX_TEXTS } from "@/scenes/GameScene";
import { Page } from "./Page";
import { GameState } from "@/utils/GameState";
import { PlayerImage, PlayerText } from "../Player";

export class PairingPage extends Page {
	constructor(scene: GameScene) {
		super(scene, GameState.Pairing);
	}

	onActivate(): void {
		const allPlayers = this.players;
		const allImages = this.players.map((player) => player.images).flat();
		const allTexts = this.players.map((player) => player.texts).flat();

		if (allImages.length == 0 || allTexts.length == 0) {
			console.error("No images or texts to pair");
			return this.scene.progressState();
		}

		// Set up image pools
		let imagePools: PlayerImage[][] = [];
		let textPools: PlayerText[][] = [];
		let excessTexts: PlayerText[] = [];

		this.players.forEach((player, pIndex) => {
			imagePools[pIndex] = [...player.images];
			textPools[pIndex] = [...player.texts];

			Phaser.Math.RND.shuffle(imagePools[pIndex]);
			Phaser.Math.RND.shuffle(textPools[pIndex]);

			// If players have more than 3 texts, move it to excess
			while (textPools[pIndex].length > MAX_TEXTS) {
				excessTexts.push(textPools[pIndex].pop()!);
			}
		});

		// Shuffle excess texts
		Phaser.Math.RND.shuffle(excessTexts);

		this.players.forEach((player, pIndex) => {
			// Fill image pools if player has less than 3 images
			while (imagePools[pIndex].length < MAX_IMAGES) {
				if (imagePools[pIndex].length > 0) {
					imagePools[pIndex].push(imagePools[pIndex][0]);
				} else {
					imagePools[pIndex].push(Phaser.Math.RND.pick(allImages));
				}
			}

			// Distribute excess texts
			while (textPools[pIndex].length < MAX_TEXTS) {
				if (excessTexts.length > 0) {
					textPools[pIndex].push(excessTexts.pop()!);
				} else {
					textPools[pIndex].push(Phaser.Math.RND.pick(allTexts));
				}
			}
		});

		const poolRotations: number[] = [];
		for (let i = 0; i < MAX_IMAGES + MAX_TEXTS; i++) {
			const index = i % Math.max(this.players.length - 1, 1);
			poolRotations.push(index + 1);
		}
		Phaser.Math.RND.shuffle(poolRotations);

		// Rotate images and texts such that players get images and texts from each other
		imagePools = imagePools.map((pool, pIndex) => {
			return pool.map((image, iIndex) => {
				const newIndex = (pIndex + poolRotations[iIndex]) % imagePools.length;
				return imagePools[newIndex][iIndex];
			});
		});
		textPools = textPools.map((pool, pIndex) => {
			return pool.map((text, iIndex) => {
				const newIndex =
					(pIndex + poolRotations[iIndex + MAX_IMAGES]) % textPools.length;
				return textPools[newIndex][iIndex];
			});
		});

		this.players.forEach((player, pIndex) => {
			this.socket.startMashup(
				imagePools[pIndex],
				textPools[pIndex],
				player.userId
			);
		});
	}
}
