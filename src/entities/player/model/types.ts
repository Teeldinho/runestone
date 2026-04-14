import type { CameraMode } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";
import type { PLAYER_EVENTS } from "../config/playerEvents";
import type { PlayerHealthState } from "../config/playerStates";

export type { PlayerHealthState };

export type PlayerMovementState = "idle" | "walking";

export type PlayerStats = {
	maxHp: number;
	hp: number;
	score: number;
	keyCount: number;
	chainMultiplier: number;
};

export type PlayerSnapshot = {
	isSprinting: boolean;
	position: Vector3Tuple;
	velocity: Vector3Tuple;
	movementState: PlayerMovementState;
	healthState: PlayerHealthState;
	stats: PlayerStats;
};

export type PlayerMeshInput = {
	healthState: PlayerHealthState;
	origin: Vector3Tuple;
};

export type PlayerMeshSettings = {
	auraColor: string;
	auraEmissiveIntensity: number;
	position: Vector3Tuple;
};

export type UsePlayerMeshInput = {
	healthState?: PlayerHealthState;
	position?: Vector3Tuple;
};

export type PlayerAvatarVisibility = {
	isAuraVisible: boolean;
	isAvatarVisible: boolean;
};

export type ResolvePlayerAvatarVisibilityInput = {
	cameraMode: CameraMode | string;
};

// Player machine context — source of truth for all player state
export type PlayerMachineContext = {
	isSprinting: boolean;
	position: Vector3Tuple;
	velocity: Vector3Tuple;
	stats: PlayerStats;
};

// Player machine event types
export type PlayerMoveEvent = {
	type: typeof PLAYER_EVENTS.MOVE;
	velocity: Vector3Tuple;
	isSprinting: boolean;
};

export type PlayerStopEvent = {
	type: typeof PLAYER_EVENTS.STOP;
};

export type PlayerTakeDamageEvent = {
	type: typeof PLAYER_EVENTS.TAKE_DAMAGE;
	amount: number;
};

export type PlayerHealEvent = {
	type: typeof PLAYER_EVENTS.HEAL;
	amount: number;
};

export type PlayerDieEvent = {
	type: typeof PLAYER_EVENTS.DIE;
};

export type PlayerRestartEvent = {
	type: typeof PLAYER_EVENTS.RESTART;
};

export type PlayerMachineEvent =
	| PlayerMoveEvent
	| PlayerStopEvent
	| PlayerTakeDamageEvent
	| PlayerHealEvent
	| PlayerDieEvent
	| PlayerRestartEvent;
