export class Player {
	public playerId: string;
	public online: boolean;

	constructor(playerId: string) {
		this.playerId = playerId;
		this.online = true;
	}

	update(time: number, delta: number) {}
}
