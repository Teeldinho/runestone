export const checkIsPlayerInDetectionRange = (
	_enemyPosition: [number, number, number],
	_playerPosition: [number, number, number],
	_detectionRadius: number,
): boolean => false;

export const checkIsPlayerInAttackRange = (
	_enemyPosition: [number, number, number],
	_playerPosition: [number, number, number],
	_attackRadius: number,
): boolean => false;

export const checkIsLethalDamageForEnemy = (
	_hp: number,
	_amount: number,
): boolean => false;
