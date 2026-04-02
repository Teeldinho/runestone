export type CombatState = "idle" | "engaged" | "victory" | "defeat";

export type CombatSnapshot = {
	enemiesAlive: number;
	playerHp: number;
	state: CombatState;
};

export type CombatActionResult = {
	damageDealt: number;
	enemyDefeated: boolean;
};
