// biome-ignore format: keep TODO comment readable
export const PLAYER_GROUNDING_CONFIG = {
	// TODO: Replace velocity-epsilon grounding with Rapier contact/raycast
	// grounding once mobile camera/input stabilisation is complete.
	VERTICAL_VELOCITY_EPSILON: 0.05,
} as const;
