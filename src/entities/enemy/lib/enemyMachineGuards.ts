import type { Vector3Tuple } from "@/shared/types";

const computeSquaredDistance = (a: Vector3Tuple, b: Vector3Tuple): number => {
	const dx = a[0] - b[0];
	const dy = a[1] - b[1];
	const dz = a[2] - b[2];
	return dx * dx + dy * dy + dz * dz;
};

export const checkIsPlayerInDetectionRange = (
	enemyPosition: Vector3Tuple,
	playerPosition: Vector3Tuple,
	detectionRadius: number,
): boolean =>
	computeSquaredDistance(enemyPosition, playerPosition) <=
	detectionRadius * detectionRadius;

export const checkIsPlayerInAttackRange = (
	enemyPosition: Vector3Tuple,
	playerPosition: Vector3Tuple,
	attackRadius: number,
): boolean =>
	computeSquaredDistance(enemyPosition, playerPosition) <=
	attackRadius * attackRadius;

export const checkIsLethalDamageForEnemy = (
	hp: number,
	amount: number,
): boolean => hp - amount <= 0;
