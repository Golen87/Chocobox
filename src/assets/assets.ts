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
	spritesheet("ui/card.png", "card", 400, 600),
];

/* Audios */
const audios: Audio[] = [
	music("Opening Theme.mp3", "title"),
	music("Peaceful Mushroom Village.mp3", "lobby"),
	// music("Traveling The Warp Pipe.mp3", "cutscene"),
	music("Play A Mini-Game!.mp3", "cutscene"),
	music("Mini Game Island All-In-One.mp3", "drawing"),
	music("Mushroom Forest.mp3", "writing"),
	music("Tropical Island.mp3", "pairing"),
	music("The Room Underground.mp3", "showdown"),
	music("After The Victory.mp3", "winner"),

	music("Mini Game Victory 3.mp3", "victory_1"),
	music("Mini Game Victory 4.mp3", "victory_2"),
	music("Mini Game Victory 5.mp3", "victory_3"),
	// music("Rainbow Castle.mp3", "title"),
	
	sound("memes/anger.ogg", "anger"),
	sound("memes/bonk.ogg", "bonk"),
	sound("memes/boom.ogg", "boom"),
	sound("memes/bruh.ogg", "bruh"),
	sound("memes/bup.ogg", "bup"),
	sound("memes/crab.ogg", "crab"),
	sound("memes/disc.ogg", "disc"),
	sound("memes/dog.ogg", "dog"),
	sound("memes/e.ogg", "e"),
	sound("memes/gaster.ogg", "gaster"),
	sound("memes/gnome.ogg", "gnome"),
	sound("memes/gun.ogg", "gun"),
	sound("memes/mariopaint_baby.ogg", "mariopaint_baby"),
	sound("memes/mariopaint_cat.ogg", "mariopaint_cat"),
	sound("memes/mariopaint_dog.ogg", "mariopaint_dog"),
	sound("memes/necoarc.ogg", "necoarc"),
	sound("memes/oof.ogg", "oof"),
	sound("memes/pizza.ogg", "pizza"),
	sound("memes/smw_1up.ogg", "smw_1up"),
	sound("memes/smw_spinjump.ogg", "smw_spinjump"),
	sound("memes/smw_stomp.ogg", "smw_stomp"),
	sound("memes/smw_yoshi.ogg", "smw_yoshi"),
	sound("memes/swan.ogg", "swan"),
	sound("memes/thwomp.ogg", "thwomp"),
	sound("memes/whatsapp.ogg", "whatsapp"),
	sound("memes/yoda.ogg", "yoda"),
];

/* Fonts */
await loadFont("DynaPuff-Medium", "Game Font");

export { images, spritesheets, audios };
