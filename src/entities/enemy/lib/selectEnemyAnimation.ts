import { ENEMY_MACHINE_STATES } from "../config";
import { ENEMY_ANIMATION_NAMES } from "../config/enemyGltfConfig";

export const selectEnemyAnimation = (state: string): string => {
	switch (state) {
		case ENEMY_MACHINE_STATES.PATROL:
			return ENEMY_ANIMATION_NAMES.WALK;
		case ENEMY_MACHINE_STATES.CHASE:
			return ENEMY_ANIMATION_NAMES.RUN;
		case ENEMY_MACHINE_STATES.ATTACK:
			return ENEMY_ANIMATION_NAMES.ATTACK;
		case ENEMY_MACHINE_STATES.DEAD:
			return ENEMY_ANIMATION_NAMES.DEATH;
		default:
			return ENEMY_ANIMATION_NAMES.IDLE;
	}
};
