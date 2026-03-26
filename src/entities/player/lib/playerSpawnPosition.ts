/**
 * Player spawn position calculations.
 *
 * The RigidBody is centered at the spawn point.
 * The CapsuleCollider extends halfHeight up and down from center.
 * The GLTF model must be offset so its feet are at the RigidBody bottom.
 */

/**
 * Calculates the correct Y offset for the player's visual mesh
 * so it stands on the floor, not buried in it.
 */
export const calculatePlayerVisualOffsetY = (
	capsuleHalfHeight: number,
	modelHeightAtScale1: number,
	modelScale: number,
): number => {
	const scaledModelHeight = modelHeightAtScale1 * modelScale;
	const modelHalfHeight = scaledModelHeight / 2;
	return -capsuleHalfHeight + modelHalfHeight;
};

/**
 * Calculates the spawn Y position for the player.
 * The player should spawn with their feet at the collider top.
 * The RigidBody center is at colliderTop + capsuleHalfHeight.
 */
export const calculatePlayerSpawnY = (
	capsuleHalfHeight: number,
	colliderTop: number,
): number => {
	return colliderTop + capsuleHalfHeight;
};

/**
 * Calculates the floor collider Y position and height.
 * The collider should be just below the visual floor tiles.
 */
export const calculateFloorCollider = (
	visualFloorY: number,
	colliderThickness: number,
): { height: number; y: number } => {
	return {
		y: visualFloorY - colliderThickness / 2,
		height: colliderThickness,
	};
};
