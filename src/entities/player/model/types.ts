import type { Vector3Tuple } from "@/shared/types";

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
