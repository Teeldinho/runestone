const computeSquaredDistance = (
	a: [number, number, number],
	b: [number, number, number],
): number => {
	const dx = a[0] - b[0];
	const dy = a[1] - b[1];
	const dz = a[2] - b[2];
	return dx * dx + dy * dy + dz * dz;
};

export const checkIsPlayerInDetectionRange = (
	enemyPosition: [number, number, number],
	playerPosition: [number, number, number],
	detectionRadius: number,
): boolean =>
	computeSquaredDistance(enemyPosition, playerPosition) <=
	detectionRadius * detectionRadius;

export const checkIsPlayerInAttackRange = (
	enemyPosition: [number, number, number],
	playerPosition: [number, number, number],
	attackRadius: number,
): boolean =>
	computeSquaredDistance(enemyPosition, playerPosition) <=
	attackRadius * attackRadius;

export const checkIsLethalDamageForEnemy = (
	hp: number,
	amount: number,
): boolean => hp - amount <= 0;
