import type {
	IntersectionEnterHandler,
	IntersectionEnterPayload,
	IntersectionExitHandler,
	IntersectionExitPayload,
} from "@react-three/rapier";
import type { CameraMode } from "@/shared/config";
import type { Vector3Tuple } from "@/shared/lib";
import type { PLAYER_EVENTS } from "../config/playerEvents";
import type { PLAYER_EVENT_TYPES } from "../config/playerEventTypes";
import type { PlayerHealthState } from "../config/playerStates";

export type { PlayerHealthState };

export type PlayerMovementState =
	| "idle"
	| "walking"
	| "running"
	| "grounded"
	| "jumping"
	| "falling";

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
	origin: Vector3Tuple;
};

export type PlayerMeshSettings = {
	position: Vector3Tuple;
};

export type PlayerGroundSensorColliderProps = {
	readonly args: [number, number, number];
	readonly mass: number;
	readonly onIntersectionEnter: IntersectionEnterHandler;
	readonly onIntersectionExit: IntersectionExitHandler;
	readonly position: [number, number, number];
	readonly sensor: true;
};

export type PlayerGroundSensorIntersectionPayload =
	| IntersectionEnterPayload
	| IntersectionExitPayload;

export type UsePlayerMeshInput = {
	position?: Vector3Tuple;
};

export type PlayerAvatarVisibility = {
	isAvatarVisible: boolean;
};

export type ResolvePlayerAvatarVisibilityInput = {
	cameraMode: CameraMode | string;
};

export type InputVector2 = {
	readonly x: number;
	readonly y: number;
};

export type PlayerMachineContext = {
	isSprinting: boolean;
	position: Vector3Tuple;
	velocity: Vector3Tuple;
	stats: PlayerStats;
	moveVector: InputVector2;
	wantsJumpImpulse: boolean;
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

export type PlayerMoveChangedEvent = {
	readonly type: typeof PLAYER_EVENT_TYPES.MOVE_CHANGED;
	readonly vector: InputVector2;
	readonly wantsRun: boolean;
};

export type PlayerMoveStoppedEvent = {
	readonly type: typeof PLAYER_EVENT_TYPES.MOVE_STOPPED;
};

export type PlayerJumpPressedEvent = {
	readonly type: typeof PLAYER_EVENT_TYPES.JUMP_PRESSED;
};

export type PlayerLandedEvent = {
	readonly type: typeof PLAYER_EVENT_TYPES.LANDED;
};

export type PlayerLeftGroundEvent = {
	readonly type: typeof PLAYER_EVENT_TYPES.LEFT_GROUND;
};

export type PlayerMachineEvent =
	| PlayerTakeDamageEvent
	| PlayerHealEvent
	| PlayerDieEvent
	| PlayerRestartEvent
	| PlayerMoveChangedEvent
	| PlayerMoveStoppedEvent
	| PlayerJumpPressedEvent
	| PlayerLandedEvent
	| PlayerLeftGroundEvent;
