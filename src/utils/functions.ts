import { BaseScene } from "@/scenes/BaseScene";

export function activateDragDebug(scene: BaseScene, obj: any) {
	const coordText = scene
		.addText({ text: "Hello!", size: 20, color: "red" })
		.setOrigin(0.5);
	coordText.setStroke("white", 6);
	coordText.setVisible(false);
	obj
		.setInteractive({ draggable: true })
		.on("drag", function (pointer: any, dragX: any, dragY: any) {
			obj.setPosition(Math.round(dragX), Math.round(dragY));
			coordText.setText(`x: ${obj.x}\ny: ${obj.y}`);
			coordText.setPosition(obj.x, obj.y);
			coordText.setVisible(true);
		});
}
