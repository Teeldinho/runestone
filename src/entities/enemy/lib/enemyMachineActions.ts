export const applyDamageToEnemy = (hp: number, amount: number): number =>
	Math.max(hp - amount, 0);

export const applyDeathToEnemy = (): number => 0;
