import type { Vector3Tuple } from "@/shared/types";

import type { PLAYER_EVENTS } from "../config/playerEvents";

export type PlayerMovementState = "idle" | "walk" | "run";

export type PlayerHealthState = "alive" | "damaged" | "dead";

export type PlayerStats = {
	maxHp: number;
	hp: number;
	score: number;
	keyCount: number;
	chainMultiplier: number;
};

export type PlayerSnapshot = {
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
};

// Player machine context — source of truth for all player state
export type PlayerMachineContext = {
	position: Vector3Tuple;
	velocity: Vector3Tuple;
	stats: PlayerStats;
};

// Player machine event types
export type PlayerMoveEvent = {
	type: typeof PLAYER_EVENTS.MOVE;
	velocity: Vector3Tuple;
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

export type PlayerMachineEvent =
	| PlayerMoveEvent
	| PlayerStopEvent
	| PlayerTakeDamageEvent
	| PlayerHealEvent
	| PlayerDieEvent;
