export const ENEMY_GLTF_CONFIG = {
	CHARACTER: {
		PATH: "/models/enemies/Barbarian.glb",
		SCALE: [0.76, 0.76, 0.76] as const,
		POSITION_Y: -0.91,
		ANIMATION_FADE_DURATION_SEC: 0.2,
	},
} as const;

export const ENEMY_ANIMATION_PATHS = {
	MOVEMENT_BASIC: "/models/animations/Rig_Medium_MovementBasic.glb",
	GENERAL: "/models/animations/Rig_Medium_General.glb",
	COMBAT_MELEE: "/models/animations/Rig_Medium_CombatMelee.glb",
} as const;

export const ENEMY_ANIMATION_NAMES = {
	IDLE: "Idle_A",
	WALK: "Walking_A",
	RUN: "Running_A",
	ATTACK: "Melee_1H_Attack_Chop",
	DEATH: "Death_A",
} as const;
