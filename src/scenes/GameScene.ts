import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { SocketManager } from "@/socket/SocketManager";
import { Color } from "@/utils/colors";
import { GameState } from "@/utils/GameState";

import { Page } from "@/components/pages/Page";
import { TitlePage } from "@/components/pages/TitlePage";
import { LobbyPage } from "@/components/pages/LobbyPage";
import { CutscenePage } from "@/components/pages/CutscenePage";
import { DrawingPage } from "@/components/pages/DrawingPage";
import { WritingPage } from "@/components/pages/WritingPage";
import { PairingPage } from "@/components/pages/PairingPage";
import { ShowdownPage } from "@/components/pages/ShowdownPage";
import { WinnerPage } from "@/components/pages/WinnerPage";
import { ClientIncoming, ClientType } from "@/socket/clientProtocol";
import * as Client from "@/socket/clientProtocol";
import { OmniType } from "@/socket/omniProtocol";
import * as Omni from "@/socket/omniProtocol";
import { PlayerPanel } from "@/components/PlayerPanel";
import { fakeSubmit } from "@/components/EXAMPLE_IMAGES";

export const MAX_IMAGES = 3;
export const MAX_TEXTS = 3;
export const MAX_PAIRINGS = 3;

export class GameScene extends BaseScene implements ClientIncoming {
	private state: GameState;
	private socket: SocketManager;
	private pages: Page[];
	private players: Player[];

	private titlePage: TitlePage;
	private lobbyPage: LobbyPage;
	private cutscenePage: CutscenePage;
	private drawingPage: DrawingPage;
	private writingPage: WritingPage;
	private pairingPage: PairingPage;
	private showdownPage: ShowdownPage;
	private winnerPage: WinnerPage;

	private playerPanel: PlayerPanel;

	constructor() {
		super({ key: "GameScene" });
	}

	create() {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(Color.Sky900);

		/* Socket */

		this.socket = new SocketManager({
			[OmniType.Code]: this.onPublicCode.bind(this),
			[OmniType.UserJoin]: this.onUserJoin.bind(this),
			[OmniType.UserLeave]: this.onUserLeave.bind(this),
			[ClientType.SubmitImage]: this.onSubmitImage.bind(this),
			[ClientType.SubmitText]: this.onSubmitText.bind(this),
			[ClientType.SubmitVote]: this.onSubmitVote.bind(this),
			[ClientType.SubmitMovement]: this.onSubmitMovement.bind(this),
			[ClientType.SubmitMashup]: this.onSubmitMashup.bind(this),
		});

		/* Pages */

		this.pages = [
			(this.titlePage = new TitlePage(this)),
			(this.lobbyPage = new LobbyPage(this)),
			(this.cutscenePage = new CutscenePage(this)),
			(this.drawingPage = new DrawingPage(this)),
			(this.writingPage = new WritingPage(this)),
			(this.pairingPage = new PairingPage(this)),
			(this.showdownPage = new ShowdownPage(this)),
			(this.winnerPage = new WinnerPage(this)),
		];

		/* Players */

		this.players = [];

		this.playerPanel = new PlayerPanel(this, this.CX, this.H - 150);
		this.playerPanel.updatePlayers(this.players);

		/* Init */

		this.setState(GameState.Lobby);

		const k = this.input.keyboard;
		k?.on("keydown-ONE", () => this.setState(GameState.Title));
		k?.on("keydown-TWO", () => this.setState(GameState.Lobby));
		k?.on("keydown-THREE", () => this.setState(GameState.Cutscene));
		k?.on("keydown-FOUR", () => this.setState(GameState.Drawing));
		k?.on("keydown-FIVE", () => this.setState(GameState.Writing));
		k?.on("keydown-SIX", () => this.setState(GameState.Pairing));
		k?.on("keydown-SEVEN", () => this.setState(GameState.Showdown));
		k?.on("keydown-EIGHT", () => this.setState(GameState.Winner));
		k?.on("keydown-SPACE", () => this.progressState());

		// Fake
		this.addEvent(500, () => fakeSubmit(this, "abcdef"));
	}

	setState(state: GameState) {
		this.state = state;

		Object.values(this.pages).forEach((page: Page) =>
			page.setVisible(page.gameState == this.state)
		);
		this.playerPanel.setVisible(
			state == GameState.Drawing ||
				state == GameState.Writing ||
				state == GameState.Pairing
		);

		if (state == GameState.Title) {
			this.socket.disconnect();
			this.players = [];
		}
		if (state == GameState.Lobby) {
			this.socket.connect();
		}
		if (
			state == GameState.Drawing ||
			state == GameState.Writing ||
			state == GameState.Pairing
		) {
			this.playerPanel.updateCount(
				this.players.map((player) => 0),
				1
			);
		}

		this.playMusic(state);
	}

	progressState() {
		const index = this.pages.findIndex((page) => page.gameState == this.state);
		const nextPage = this.pages[index + 1];
		if (nextPage) {
			this.setState(nextPage.gameState);
		}
	}

	update(time: number, delta: number) {
		Object.values(this.pages).forEach((page: Page) => {
			if (page.gameState == this.state) {
				page.update(time, delta);
			}
		});

		this.players.forEach((player) => player.update(time, delta));

		this.playerPanel.update(time, delta);
	}

	playMusic(song: string) {
		this.sound.stopAll();
		this.sound.play(song, { loop: true, volume: 0.3 });
	}

	/* Socket callbacks */

	onPublicCode({ code }: Omni.ServerCode) {
		this.lobbyPage.setCode(code);
	}

	onUserJoin({ user, role, name }: Omni.UserJoin) {
		if (role != "guest") {
			return console.error("User role not guest", user, role);
		}
		if (!name) {
			return console.error("User name not provided", user, name);
		}

		const player = this.getPlayer(user);
		if (player) {
			player.online = true;
		} else {
			this.players.push(new Player(user, name));
		}

		this.playerPanel.updatePlayers(this.players);
		this.pages.forEach((page: Page) => page.updatePlayers());
	}

	onUserLeave({ user, role }: Omni.UserLeave) {
		const player = this.getPlayer(user);
		if (!player) {
			return console.error("Player not found", user);
		}

		if (this.state == GameState.Lobby) {
			this.players = this.players.filter((player) => player.userId !== user);
		} else {
			player.online = false;
		}

		this.playerPanel.updatePlayers(this.players);
		this.pages.forEach((page) => page.updatePlayers());
	}

	onSubmitImage({ user, base64 }: Client.SubmitImage) {
		const player = this.getPlayer(user);
		if (!player) {
			return console.error("Player not found", user);
		}
		if (this.state != GameState.Drawing) {
			return console.error("Cannot submit image in current state", this.state);
		}

		// Add image to player
		const round = player.images.length + 1;
		const imageId = `${user}_drawing_${round}`;
		player.addImage(imageId, base64, round);

		// Load base64 texture
		this.textures.addBase64(imageId, base64);
		this.textures.once("addtexture-" + imageId, () => {
			// Image is ready
		});

		// Update player panel submission count
		this.playerPanel.updateCount(
			this.players.map((player) => player.images.length),
			MAX_IMAGES
		);

		// Check if all players have submitted
		const allImagesDone = this.players.every(
			(player) => player.images.length >= MAX_IMAGES
		);
		// if (allImagesDone) {
		// 	// this.drawingPage.allPlayersDone();
		// 	this.addEvent(1000, this.progressState, this);
		// }
	}

	onSubmitText({ user, text }: Client.SubmitText) {
		const player = this.getPlayer(user);
		if (!player) {
			return console.error("Player not found", user);
		}
		if (this.state != GameState.Writing) {
			return console.error("Cannot submit text in current state", this.state);
		}

		// Add text to player
		const round = player.texts.length + 1;
		const textId = `${user}_writing_${round}`;
		player.addText(textId, text, round);

		// Update player panel submission count
		this.playerPanel.updateCount(
			this.players.map((player) => player.texts.length),
			MAX_TEXTS
		);

		// Check if all players have submitted
		const allTextsDone = this.players.every(
			(player) => player.texts.length >= MAX_TEXTS
		);
		// if (allTextsDone) {
		// 	// this.writingPage.allPlayersDone();
		// 	this.addEvent(1000, this.progressState, this);
		// }
	}

	onSubmitVote({ user, vote }: Client.SubmitVote) {
		console.log("User submitted vote", user, vote);
	}

	onSubmitMovement({ user, x, y }: Client.SubmitMovement) {
		console.log("User submitted movement", user, x, y);
	}

	onSubmitMashup({ user, imageId, textId }: Client.SubmitMashup) {
		const player = this.getPlayer(user);
		if (!player) {
			return console.error("Player not found", user);
		}
		if (this.state != GameState.Pairing) {
			return console.error(
				"Cannot submit pairing in current state",
				this.state
			);
		}

		// Add image to player
		const round = player.pairings.length + 1;
		const pairingId = `${user}_pairing_${round}`;
		player.addPairing(pairingId, imageId, textId);

		// Update player panel submission count
		this.playerPanel.updateCount(
			this.players.map((player) => player.pairings.length),
			MAX_PAIRINGS
		);

		// Check if all players have submitted
		const allPairingsDone = this.players.every(
			(player) => player.pairings.length >= MAX_PAIRINGS
		);
		// if (allPairingsDone) {
		// 	// this.pairingPage.allPlayersDone();
		// 	this.addEvent(1000, this.progressState, this);
		// }
	}

	/* Getters */

	getSocket(): SocketManager {
		return this.socket;
	}

	getPlayers(): Player[] {
		return this.players;
	}

	getPlayer(userId: string): Player | undefined {
		return this.players.find((player) => player.userId == userId);
	}

	getPlayerText(textId: string) {
		const player = this.players.find((player) =>
			player.texts.some((text) => text.id == textId)
		);
		return player?.texts.find((text) => text.id == textId)?.text;
	}
}
