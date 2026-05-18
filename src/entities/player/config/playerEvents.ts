export const PLAYER_EVENTS = {
	TAKE_DAMAGE: "TAKE_DAMAGE",
	HEAL: "HEAL",
	DIE: "DIE",
	RESTART: "RESTART",
} as const;

export type PlayerEvent = (typeof PLAYER_EVENTS)[keyof typeof PLAYER_EVENTS];
