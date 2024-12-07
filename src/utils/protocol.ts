export enum Request {
	ServerToken = "token",

	SetMode = "set_mode",
}

export enum Response {
	ServerConnect = "server_connect",
	ServerDisconnect = "server_disconnect",
	ServerAuthorized = "server_authorized",
	ServerCode = "server_code",
	ServerError = "server_error",
	UserJoin = "server_join",
	UserLeave = "server_leave",

	SubmitImage = "submit_image",
	SubmitText = "submit_text",
	SubmitVote = "submit_vote",
	SubmitMovement = "movement",
}

/*** Requests ***/

// Sending token
export interface ServerToken {
	token: string;
}

// Tell clients to set input mode
export interface SetMode {
	type: Request.SetMode;
	mode: "blank" | "drawing" | "typing" | "voting" | "joystick";
}

export type AnyRequest = ServerToken | SetMode;

/*** Responses ***/

// Upon connecting successfully
export interface ServerConnect {
	type: Response.ServerConnect;
	message: string;
}

// Upon forced disconnect
export interface ServerDisconnect {
	type: Response.ServerDisconnect;
	message: string;
}

// Upon authorizing successfully
export interface ServerAuthorized {
	type: Response.ServerAuthorized;
	message: string;
}

// Upon receiving public visitor code
export interface ServerCode {
	type: Response.ServerCode;
	code: string;
}

// Errors including non-json message sent or invalid token.
export interface ServerError {
	type: Response.ServerError;
	message: string;
}

// Upon new application connecting.
export interface UserJoin {
	type: Response.UserJoin;
	user: string;
	role: "host" | "client" | "guest";
}

// Upon application disconnecting.
export interface UserLeave {
	type: Response.UserLeave;
	user: string;
	role: "host" | "client" | "guest";
}

// Upon client submitting a base64 image
export interface SubmitImage {
	type: Response.SubmitImage;
	user: string;
	image: string;
}

// Upon client submitting a text response
export interface SubmitText {
	type: Response.SubmitText;
	user: string;
	text: string;
}

// Upon client submitting a vote
export interface SubmitVote {
	type: Response.SubmitVote;
	user: string;
	vote: string;
}

// Upon client submitting a vote
export interface SubmitMovement {
	type: Response.SubmitMovement;
	user: string;
	x: number;
	y: number;
}

export type AnyResponse =
	| ServerConnect
	| ServerDisconnect
	| ServerAuthorized
	| ServerCode
	| ServerError
	| UserJoin
	| UserLeave
	| SubmitImage
	| SubmitText
	| SubmitVote;
