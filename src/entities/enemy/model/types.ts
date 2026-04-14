import type { Vector3Tuple } from "@/shared/lib";
import type { ENEMY_EVENTS } from "../config/enemyEvents";
import type { EnemyBehaviorState } from "../config/enemyMachineStates";

export type { EnemyBehaviorState };

export type EnemyActorSnapshot = {
	id: string;
	roomId: string;
	state: EnemyBehaviorState;
	position: Vector3Tuple;
	hp: number;
	maxHp: number;
};

export type EnemyMachineContext = {
	id: string;
	roomId: string;
	position: Vector3Tuple;
	playerPosition: Vector3Tuple;
	hp: number;
	maxHp: number;
};

export type EnemyMachineInput = {
	id: string;
	roomId: string;
	position: Vector3Tuple;
};

export type EnemyUpdatePlayerPositionEvent = {
	type: typeof ENEMY_EVENTS.UPDATE_PLAYER_POSITION;
	position: Vector3Tuple;
};

export type EnemyTakeDamageEvent = {
	type: typeof ENEMY_EVENTS.TAKE_DAMAGE;
	amount: number;
};

export type EnemyMachineEvent =
	| EnemyUpdatePlayerPositionEvent
	| EnemyTakeDamageEvent;

export type EnemyGlowSettings = {
	color: string;
	emissiveIntensity: number;
};
