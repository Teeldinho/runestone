import type { Vector3Tuple } from "@/shared/types";

export type EnemyBehaviorState =
	| "patrol"
	| "detect"
	| "chase"
	| "attack"
	| "dead";

export type EnemyActorSnapshot = {
	id: string;
	roomId: string;
	state: EnemyBehaviorState;
	position: Vector3Tuple;
	hp: number;
	maxHp: number;
};
