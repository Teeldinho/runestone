import type { Vector3Tuple } from "@/shared/lib";

import { computeSquaredDistance } from "./computeSquaredDistance";

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
