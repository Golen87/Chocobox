export interface PlayerImage {
	id: string;
	base64: string;
	user: string;
}

export interface PlayerText {
	id: string;
	text: string;
	user: string;
}

export interface PlayerPair {
	id: string;
	imageId: string;
	textId: string;
	user: string;
	votes: number;
}

export class Player {
	public userId: string;
	public name: string;
	public online: boolean;

	public images: PlayerImage[];
	public texts: PlayerText[];
	public pairings: PlayerPair[];

	constructor(userId: string, playerName: string) {
		this.userId = userId;
		this.name = playerName;
		this.online = true;

		this.images = [];
		this.texts = [];
		this.pairings = [];
	}

	update(time: number, delta: number) {}

	addImage(id: string, base64: string, round: number) {
		this.images.push({ id, base64, user: this.userId });
	}

	addText(id: string, text: string, round: number) {
		this.texts.push({ id, text, user: this.userId });
	}

	addPairing(id: string, imageId: string, textId: string) {
		this.pairings.push({ id, imageId, textId, user: this.userId, votes: 0 });
	}
}
