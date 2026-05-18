export const INPUT_EVENT_TYPES = {
	POINTER_OWNER_ASSIGNED: "input.pointer.owner.assigned",
	POINTER_OWNER_RELEASED: "input.pointer.owner.released",

	MOVE_CHANGED: "input.move.changed",
	MOVE_STOPPED: "input.move.stopped",

	RUN_TOGGLED: "input.run.toggled",

	JUMP_PRESSED: "input.jump.pressed",

	INTERACT_PRESSED: "input.interact.pressed",
	ATTACK_PRESSED: "input.attack.pressed",
	FIRE_PRESSED: "input.fire.pressed",

	KEY_DOWN: "input.keyboard.down",
	KEY_UP: "input.keyboard.up",
} as const;

export type InputEventType =
	(typeof INPUT_EVENT_TYPES)[keyof typeof INPUT_EVENT_TYPES];
