import { BaseScene } from "@/scenes/BaseScene";
import { Player } from "@/components/Player";
import { SocketManager } from "@/utils/SocketManager";
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

export class GameScene extends BaseScene {
	private state: GameState;
	private socket: SocketManager;
	private pages: { [key in GameState]: Page };

	private players: Map<string, Player>;

	constructor() {
		super({ key: "GameScene" });
	}

	create(): void {
		this.fade(false, 200, 0x000000);
		this.cameras.main.setBackgroundColor(Color.Sky900);

		/* Socket */

		this.socket = new SocketManager();
		this.socket.on("publicCode", this.onPublicCode, this);
		this.socket.on("userJoin", this.onUserJoin, this);
		this.socket.on("userLeave", this.onUserLeave, this);
		this.socket.on("submitImage", this.onSubmitImage, this);
		this.socket.on("submitText", this.onSubmitText, this);
		this.socket.on("submitVote", this.onSubmitVote, this);
		this.socket.on("submitMovement", this.onSubmitMovement, this);

		/* Pages */

		this.pages = {
			[GameState.Title]: new TitlePage(this),
			[GameState.Lobby]: new LobbyPage(this),
			[GameState.Cutscene]: new CutscenePage(this),
			[GameState.Drawing]: new DrawingPage(this),
			[GameState.Writing]: new WritingPage(this),
			[GameState.Pairing]: new PairingPage(this),
			[GameState.Showdown]: new ShowdownPage(this),
			[GameState.Winner]: new WinnerPage(this),
		};

		/* Graphics */

		this.players = new Map();

		/* Init */

		this.setState(GameState.Title);

		this.input.once("pointerdown", () => {
			this.setState(GameState.Lobby);
		});

		this.input.keyboard?.on("keydown-ONE", () =>
			this.setState(GameState.Title)
		);
		this.input.keyboard?.on("keydown-TWO", () =>
			this.setState(GameState.Lobby)
		);
		this.input.keyboard?.on("keydown-THREE", () =>
			this.setState(GameState.Cutscene)
		);
		this.input.keyboard?.on("keydown-FOUR", () =>
			this.setState(GameState.Drawing)
		);
		this.input.keyboard?.on("keydown-FIVE", () =>
			this.setState(GameState.Writing)
		);
		this.input.keyboard?.on("keydown-SIX", () =>
			this.setState(GameState.Pairing)
		);
		this.input.keyboard?.on("keydown-SEVEN", () =>
			this.setState(GameState.Showdown)
		);
		this.input.keyboard?.on("keydown-EIGHT", () =>
			this.setState(GameState.Winner)
		);
	}

	setState(state: GameState) {
		this.state = state;
		Object.values(this.pages).forEach((page: Page) =>
			page.setVisible(page.gameState == this.state)
		);

		if (state == GameState.Lobby) this.socket.connect();
	}

	update(time: number, delta: number) {
		Object.values(this.pages).forEach((page: Page) => {
			if (page.gameState == this.state) {
				page.update(time, delta);
			}
		});

		this.players.forEach((player) => player.update(time, delta));
	}

	/* Socket callbacks */

	onPublicCode(code: string) {
		this.lobbyPage.setCode(code);
	}

	onUserJoin(user: string, role: string) {
		let x = 100 + (this.W - 200) * Math.random();
		let y = 100 + (this.H - 200) * Math.random();
		let player = new Player(this, x, y);
		this.players.set(user, player);

		// this.socket.sendSetMode("blank");
		// this.socket.sendSetMode("poll");
		this.socket.sendSetMode("typing");
		// this.socket.sendSetMode("joystick");
		// this.socket.sendSetMode("drawing");
	}

	onUserLeave(user: string, role: string) {
		const player = this.players.get(user);
		if (player) {
			this.players.delete(user);
			player.destroy();
		}
	}

	onSubmitImage(user: string, image: string) {}

	onSubmitText(user: string, text: string) {}

	onSubmitVote(user: string, vote: string) {}

	onSubmitMovement(user: string, x: number, y: number) {
		const player = this.players.get(user);
		if (player) {
			player.inputVec.set(x, -y);
		}
	}

	/* Getters */

	get titlePage() {
		return this.pages[GameState.Title] as TitlePage;
	}

	get lobbyPage() {
		return this.pages[GameState.Lobby] as LobbyPage;
	}

	get cutscenePage() {
		return this.pages[GameState.Cutscene] as CutscenePage;
	}

	get drawingPage() {
		return this.pages[GameState.Drawing] as DrawingPage;
	}

	get writingPage() {
		return this.pages[GameState.Writing] as WritingPage;
	}

	get pairingPage() {
		return this.pages[GameState.Pairing] as PairingPage;
	}

	get showdownPage() {
		return this.pages[GameState.Showdown] as ShowdownPage;
	}

	get winnerPage() {
		return this.pages[GameState.Winner] as WinnerPage;
	}
}
