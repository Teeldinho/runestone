import { ENEMY_COLLIDER_CONFIG, ENEMY_GLOW_CONFIG } from "../config";

export const computeEnemySpawnHeightOffset = (): number =>
	ENEMY_COLLIDER_CONFIG.HALF_HEIGHT + ENEMY_COLLIDER_CONFIG.RADIUS;

export const computeEnemyGlowOffsetY = (): number => {
	const spawnOffset = computeEnemySpawnHeightOffset();
	return -spawnOffset + ENEMY_GLOW_CONFIG.TUBE_RADIUS;
};
