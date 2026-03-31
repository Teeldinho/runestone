import { DUNGEON_EVENTS } from "@/entities/dungeon";

export const INTERACTION_CONFIG = {
	INTERACT_RADIUS: 1.5,
	ATTACK_RADIUS: 1.5,
} as const;

export const INTERACTION_KEYS = {
	INTERACT: "f",
	ATTACK: "e",
} as const;

export const INTERACTION_PROMPTS = {
	[DUNGEON_EVENTS.PICK_UP_KEY]: "Pick Up Key",
	[DUNGEON_EVENTS.ENTER_LIBRARY]: "Enter Library",
	[DUNGEON_EVENTS.ENTER_GUARD_ROOM]: "Enter Guard Room",
	[DUNGEON_EVENTS.ENTER_TREASURY]: "Enter Treasury",
	[DUNGEON_EVENTS.ENTER_EXIT]: "Exit Floor",
	[DUNGEON_EVENTS.LOCKED_DOOR_ATTEMPT]: "Locked",
	[DUNGEON_EVENTS.LOCKED_EXIT_ATTEMPT]: "Locked",
} as const;

export const ATTACK_PROMPT = "Attack";

export const INTERACTION_KEY_LABEL = "F";
export const ATTACK_KEY_LABEL = "E";
export const MOVEMENT_KEYS_LABEL = "WASD / Arrow keys";

export const EMPTY_INTERACTION_CANDIDATES = {
	interactPrompt: null,
	attackPrompt: null,
	hasInteract: false,
	hasAttack: false,
} as const;
