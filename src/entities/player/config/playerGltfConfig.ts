export const PLAYER_GLTF_CONFIG = {
	CHARACTER: {
		PATH: "/models/adventurers/Knight.glb",
		SCALE: [0.72, 0.72, 0.72] as const,
		// Knight.glb height at scale 1.0 ≈ 2.543, scaled ≈ 1.831
		// Model half height ≈ 0.915, capsule half height = 0.55
		// POSITION_Y = -0.55 + 0.915 = 0.365
		POSITION_Y: 0.365,
	},
} as const;

export const PLAYER_ANIMATION_PATHS = {
	MOVEMENT_BASIC: "/models/animations/Rig_Medium_MovementBasic.glb",
	GENERAL: "/models/animations/Rig_Medium_General.glb",
} as const;

export const PLAYER_ANIMATION_NAMES = {
	IDLE: "Idle_A",
	WALK: "Walking_A",
	RUN: "Running_A",
	DEATH: "Death_A",
} as const;
