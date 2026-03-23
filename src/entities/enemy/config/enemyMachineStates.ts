export const ENEMY_MACHINE_STATES = {
	PATROL: "patrol",
	DETECT: "detect",
	CHASE: "chase",
	ATTACK: "attack",
	DEAD: "dead",
} as const;

export type EnemyBehaviorState =
	(typeof ENEMY_MACHINE_STATES)[keyof typeof ENEMY_MACHINE_STATES];

export const ENEMY_MACHINE_ID = "enemyBehaviorMachine" as const;

export const ENEMY_GUARDS = {
	IS_PLAYER_IN_DETECTION_RANGE: "isPlayerInDetectionRange",
	IS_PLAYER_IN_ATTACK_RANGE: "isPlayerInAttackRange",
	IS_LETHAL_DAMAGE: "isLethalDamage",
} as const;
