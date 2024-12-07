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

		this.pages.forEach((page: Page) => {
			page.on("mode", this.socket.sendSetMode, this.socket);
		});

		this.players = [];

		/* Init */

		this.setState(GameState.Title);

		const k = this.input.keyboard;
		k?.on("keydown-ONE", () => this.setState(GameState.Title));
		k?.on("keydown-TWO", () => this.setState(GameState.Lobby));
		k?.on("keydown-THREE", () => this.setState(GameState.Cutscene));
		k?.on("keydown-FOUR", () => this.setState(GameState.Drawing));
		k?.on("keydown-FIVE", () => this.setState(GameState.Writing));
		k?.on("keydown-SIX", () => this.setState(GameState.Pairing));
		k?.on("keydown-SEVEN", () => this.setState(GameState.Showdown));
		k?.on("keydown-EIGHT", () => this.setState(GameState.Winner));
	}

	setState(state: GameState) {
		this.state = state;
		Object.values(this.pages).forEach((page: Page) =>
			page.setVisible(page.gameState == this.state)
		);

		if (state == GameState.Title) {
			this.socket.disconnect();
			this.players = [];
		}
		if (state == GameState.Lobby) {
			this.socket.connect();
		}

		this.playMusic(state);
	}

	update(time: number, delta: number) {
		Object.values(this.pages).forEach((page: Page) => {
			if (page.gameState == this.state) {
				page.update(time, delta);
			}
		});

		this.players.forEach((player) => player.update(time, delta));
	}

	playMusic(song: string) {
		this.sound.stopAll();
		this.sound.play(song, { loop: true, volume: 0.3 });
	}

	/* Socket callbacks */

	onPublicCode(code: string) {
		this.lobbyPage.setCode(code);
	}

	onUserJoin(user: string, role: string) {
		const player = this.getPlayer(user);
		if (player) {
			player.online = true;
		} else {
			this.players.push(new Player(user));
		}

		this.pages.forEach((page: Page) => page.updatePlayers(this.players));
	}

	onUserLeave(user: string, role: string) {
		const player = this.getPlayer(user);
		if (!player) {
			return console.error("Player not found", user);
		}

		if (this.state == GameState.Lobby) {
			this.players = this.players.filter((player) => player.playerId !== user);
		} else {
			player.online = false;
		}

		this.pages.forEach((page) => page.updatePlayers(this.players));
	}

	onSubmitImage(user: string, image: string) {
		const key = `drawing_${user}`;
		const base64 = `data:image/png;base64,${image}`;

		this.textures.once("addtexture-" + key, () => {
			this.add.image(this.CX, this.CY, key);
		});
		this.textures.addBase64(key, base64);
	}

	onSubmitText(user: string, text: string) {}

	onSubmitVote(user: string, vote: string) {}

	onSubmitMovement(user: string, x: number, y: number) {}

	/* Getters */

	getPlayer(name: string): Player | undefined {
		return this.players.find((player) => player.playerId == name);
	}
}
