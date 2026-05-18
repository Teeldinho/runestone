import {
	PLAYER_MOVEMENT_KEY_ALIASES,
	type PlayerMovementKey,
} from "@/entities/player";

export const getKeyboardMovementKey = (key: string): PlayerMovementKey | null =>
	PLAYER_MOVEMENT_KEY_ALIASES[
		key as keyof typeof PLAYER_MOVEMENT_KEY_ALIASES
	] ?? null;
