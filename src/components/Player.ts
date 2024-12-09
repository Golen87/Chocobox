export class Player {
	public userId: string;
	public name: string;
	public online: boolean;

	public images: { id: string; base64: string; round: number }[];

	constructor(userId: string, playerName: string) {
		this.userId = userId;
		this.name = playerName;
		this.online = true;
	}

	update(time: number, delta: number) {}

	addImage(id: string, base64: string, round: number) {
		this.images.push({ id, base64, round });
	}
}
