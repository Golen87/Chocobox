import { BaseScene } from "@/scenes/BaseScene";
import * as P from "./protocol";

export class SocketManager extends Phaser.Events.EventEmitter {
	private socket: WebSocket;
	private handlers: { [type in P.Response]: (data: any) => void };

	constructor() {
		super();

		this.handlers = {
			[P.Response.ServerConnect]: this.onServerConnect,
			[P.Response.ServerDisconnect]: this.onServerDisconnect,
			[P.Response.ServerAuthorized]: this.onServerAuthorized,
			[P.Response.ServerCode]: this.onServerCode,
			[P.Response.ServerError]: this.onServerError,
			[P.Response.UserJoin]: this.onUserJoin,
			[P.Response.UserLeave]: this.onUserLeave,
			[P.Response.SubmitImage]: this.onSubmitImage,
			[P.Response.SubmitText]: this.onSubmitText,
			[P.Response.SubmitVote]: this.onSubmitVote,
			[P.Response.SubmitMovement]: this.onSubmitMovement,
		};
	}

	connect() {
		if (this.socket && this.socket.readyState !== WebSocket.CLOSED) return;

		this.socket = new WebSocket(import.meta.env.VITE_URL);
		this.socket.onopen = (event) => {};
		this.socket.onclose = (event: CloseEvent) => {};
		this.socket.onerror = (event) => {};
		this.socket.onmessage = (event: MessageEvent) => {
			this.receive(JSON.parse(event.data));
		};
	}

	disconnect() {
		this.socket.close();
	}

	/* Outgoing messages */

	send(data: P.AnyRequest) {
		if (this.socket) {
			// console.log(data);
			this.socket.send(JSON.stringify(data));
		} else console.warn("Socket not connected");
	}

	sendSetMode(mode: "blank" | "drawing" | "typing" | "voting" | "joystick") {
		this.send({
			type: P.Request.SetMode,
			mode,
		} as P.SetMode);
	}

	/* Incoming messages */

	receive(data: P.AnyResponse) {
		// console.log(data);
		if (data.type) {
			const handler = this.handlers[data.type];
			if (handler) {
				return handler.call(this, data);
			}
		}
		console.warn("Unhandled message:", data);
	}

	onServerConnect({ message }: P.ServerConnect) {
		this.send({ token: import.meta.env.VITE_TOKEN });
	}

	onServerDisconnect({ message }: P.ServerDisconnect) {}

	onServerAuthorized({ message }: P.ServerAuthorized) {}

	onServerCode({ code }: P.ServerCode) {
		this.emit("publicCode", code);
	}

	onServerError({ message }: P.ServerError) {}

	onUserJoin({ user, role }: P.UserJoin) {
		this.emit("userJoin", user, role);
	}

	onUserLeave({ user, role }: P.UserLeave) {
		this.emit("userLeave", user, role);
	}

	onSubmitImage({ user, image }: P.SubmitImage) {
		this.emit("submitImage", user, image);
	}

	onSubmitText({ user, text }: P.SubmitText) {
		this.emit("submitText", user, text);
	}

	onSubmitVote({ user, vote }: P.SubmitVote) {
		this.emit("submitVote", user, vote);
	}

	onSubmitMovement({ user, x, y }: P.SubmitMovement) {
		this.emit("submitMovement", user, x, y);
	}
}
