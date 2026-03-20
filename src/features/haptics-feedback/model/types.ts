import type { HapticPatternKey } from "@/features/haptics-feedback/config";

export type HapticEventName =
	| "onRoomEnter"
	| "onGuardSuccess"
	| "onGuardFail"
	| "onEnemyHit"
	| "onPlayerDeath"
	| "onKeyPickup"
	| "onCameraSwitch"
	| "onTransition"
	| "onAchievement"
	| "onFloorComplete";

export type HapticEventMap = Record<HapticEventName, HapticPatternKey>;
