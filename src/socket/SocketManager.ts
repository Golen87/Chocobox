import { OmniRequests, OmniResponses, OmniType } from "./omniProtocol";
import { HostOutgoing, HostRequests, HostType } from "./hostProtocol";
import { ClientResponses, ClientType } from "./clientProtocol";

type IncomingTypes = OmniType | ClientType;
type Callbacks = Partial<{ [type in IncomingTypes]: (...args: any[]) => void }>;

export class SocketManager
	extends Phaser.Events.EventEmitter
	implements HostOutgoing
{
	private socket: WebSocket;
	private callbacks: Callbacks;

	constructor(callbacks: Callbacks) {
		super();
		this.callbacks = {
			[OmniType.Connect]: () => this.sendToken(),
			[OmniType.Disconnect]: () => {},
			[OmniType.Authorized]: () => {},
			[OmniType.Code]: () => {},
			[OmniType.Error]: () => {},
			[OmniType.UserJoin]: () => {},
			[OmniType.UserLeave]: () => {},

			...callbacks,
		};
	}

	connect() {
		if (this.socket && this.socket.readyState !== WebSocket.CLOSED) return;

		this.socket = new WebSocket(import.meta.env.VITE_URL);
		this.socket.onmessage = (event: MessageEvent) =>
			this.receive(JSON.parse(event.data));
	}

	disconnect() {
		if (this.socket) {
			this.socket.close();
		}
	}

	private send(data: OmniRequests | HostRequests) {
		if (this.socket) {
			console.log(data);
			this.socket.send(JSON.stringify(data));
		} else console.warn("Socket not connected");
	}

	private receive(data: OmniResponses | ClientResponses) {
		console.log(data);
		if (data.type) {
			const handler = this.callbacks[data.type];
			if (handler) {
				return handler.call(this, data);
			}
		}
		console.warn("Unhandled message:", data);
	}

	/* Outgoing */

	private sendToken() {
		this.send({ token: import.meta.env.VITE_TOKEN });
	}

	setBlank(user?: string) {
		this.send({
			type: HostType.SetBlank,
			user,
		});
	}

	startDrawing(user?: string) {
		this.send({
			type: HostType.StartDrawing,
			user,
		});
	}

	startTyping(user?: string) {
		this.send({
			type: HostType.StartTyping,
			user,
		});
	}

	startVote(options: string[], user?: string) {
		this.send({
			type: HostType.StartVote,
			options,
			user,
		});
	}

	startMashup(
		images: { id: string; base64: string }[],
		texts: { id: string; text: string }[],
		user?: string
	) {
		this.send({
			type: HostType.StartMashup,
			images,
			texts,
			user,
		});
	}

	startJoystick(user?: string) {
		const payload: HostRequests = {
			type: HostType.StartJoystick,
			user,
		};
		this.send(payload);
	}
}
