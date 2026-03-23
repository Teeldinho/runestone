export const checkLethalDamage = (hp: number, amount: number): boolean =>
	hp - amount <= 0;

export const checkPlayerAlive = (hp: number): boolean => hp > 0;
