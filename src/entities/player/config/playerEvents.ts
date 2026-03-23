export const PLAYER_EVENTS = {
	MOVE: "MOVE",
	STOP: "STOP",
	TAKE_DAMAGE: "TAKE_DAMAGE",
	HEAL: "HEAL",
	DIE: "DIE",
} as const;

export type PlayerEvent = (typeof PLAYER_EVENTS)[keyof typeof PLAYER_EVENTS];
