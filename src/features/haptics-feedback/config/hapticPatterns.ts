export type HapticPreset =
	| "success"
	| "error"
	| "warning"
	| "nudge"
	| "light"
	| "medium"
	| "heavy"
	| "selection"
	| "bars";

export type HapticPattern =
	| HapticPreset
	| number
	| Array<{ delay?: number; duration: number; intensity?: number }>;

export const HAPTIC_PATTERNS = {
	ROOM_ENTER: "nudge",
	GUARD_SUCCESS: "success",
	GUARD_FAIL: "error",
	PLAYER_DAMAGE: "medium",
	PLAYER_DEATH: [{ duration: 200 }, { delay: 100, duration: 300 }],
	ENEMY_HIT: [{ duration: 80 }, { delay: 30, duration: 80 }],
	ENEMY_DEFEATED: "heavy",
	KEY_PICKUP: "success",
	CAMERA_SWITCH: "selection",
	TRANSITION_FIRE: "light",
	ACHIEVEMENT: "success",
	FLOOR_COMPLETE: [
		{ duration: 100 },
		{ delay: 50, duration: 100 },
		{ delay: 50, duration: 300 },
	],
} as const satisfies Record<string, HapticPattern>;

export type HapticPatternKey = keyof typeof HAPTIC_PATTERNS;
