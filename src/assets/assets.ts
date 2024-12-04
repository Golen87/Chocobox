import { Image, SpriteSheet, Audio } from "./util";
import { image, sound, music, loadFont, spritesheet } from "./util";

/* Images */
const images: Image[] = [
	// Backgrounds
	image("backgrounds/title_1.png", "title_1"),
	image("backgrounds/title_2.png", "title_2"),
	image("backgrounds/lobby_1.png", "lobby_1"),
	image("backgrounds/lobby_2.png", "lobby_2"),
	image("backgrounds/cutscene_1.png", "cutscene_1"),
	image("backgrounds/cutscene_2.png", "cutscene_2"),
	image("backgrounds/drawing_1.png", "drawing_1"),
	image("backgrounds/drawing_2.png", "drawing_2"),
	image("backgrounds/writing_1.png", "writing_1"),
	image("backgrounds/writing_2.png", "writing_2"),
	image("backgrounds/pairing_1.png", "pairing_1"),
	image("backgrounds/pairing_2.png", "pairing_2"),
	image("backgrounds/showdown_1.png", "showdown_1"),
	image("backgrounds/showdown_2.png", "showdown_2"),
	image("backgrounds/winner_1.png", "winner_1"),
	image("backgrounds/winner_2.png", "winner_2"),

	// Characters
	image("characters/player.png", "player"),

	// Titlescreen
	image("titlescreen/sky.png", "title_sky"),
	image("titlescreen/background.png", "title_background"),
	image("titlescreen/foreground.png", "title_foreground"),
	image("titlescreen/character.png", "title_character"),
];

/* Spritesheets */
const spritesheets: SpriteSheet[] = [
	spritesheet("ui/user_box.png", "user_box", 320, 320),
];

/* Audios */
const audios: Audio[] = [
	music("title", "m_main_menu"),
	music("first", "m_first"),
	sound("tree/rustle", "t_rustle", 0.5),
];

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
