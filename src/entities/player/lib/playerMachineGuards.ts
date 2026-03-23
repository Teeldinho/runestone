export const isLethalDamage = (hp: number, amount: number): boolean =>
	hp - amount <= 0;

export const isPlayerAlive = (hp: number): boolean => hp > 0;
