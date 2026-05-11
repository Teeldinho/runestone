export const PLAYER_EVENT_TYPES = {
	MOVE_CHANGED: "player.input.move.changed",
	MOVE_STOPPED: "player.input.move.stopped",
	RUN_HELD_CHANGED: "player.input.run.held.changed",
	JUMP_PRESSED: "player.input.jump.pressed",
	LANDED: "player.physics.landed",
	LEFT_GROUND: "player.physics.leftGround",
	DAMAGED: "player.vitality.damaged",
	DIED: "player.vitality.died",
} as const;

export type PlayerEventType =
	(typeof PLAYER_EVENT_TYPES)[keyof typeof PLAYER_EVENT_TYPES];
