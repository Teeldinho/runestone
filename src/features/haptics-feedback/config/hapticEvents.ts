export const HAPTIC_EVENT_NAMES = {
	ON_ROOM_ENTER: "onRoomEnter",
	ON_GUARD_SUCCESS: "onGuardSuccess",
	ON_GUARD_FAIL: "onGuardFail",
	ON_ENEMY_HIT: "onEnemyHit",
	ON_PLAYER_DEATH: "onPlayerDeath",
	ON_KEY_PICKUP: "onKeyPickup",
	ON_CAMERA_SWITCH: "onCameraSwitch",
	ON_TRANSITION: "onTransition",
	ON_ACHIEVEMENT: "onAchievement",
	ON_FLOOR_COMPLETE: "onFloorComplete",
} as const;

export type HapticEventName =
	(typeof HAPTIC_EVENT_NAMES)[keyof typeof HAPTIC_EVENT_NAMES];
