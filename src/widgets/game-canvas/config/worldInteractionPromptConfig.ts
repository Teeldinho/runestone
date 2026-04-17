import { ENEMY_SPAWN_HEIGHT_OFFSET } from "@/entities/enemy";
import { ROOM_ENTITY_CONFIG } from "@/entities/room";

export const WORLD_INTERACTION_PROMPT_CONFIG = {
	DISTANCE_FACTOR: 12,
	DOOR_HEIGHT: ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
	ENEMY_HEIGHT_OFFSET: ENEMY_SPAWN_HEIGHT_OFFSET + 0.45,
	KEY_HEIGHT: ROOM_ENTITY_CONFIG.TREASURE_KEY.HEIGHT + 1.35,
} as const;

export const WORLD_INTERACTION_PROMPT_CLASS_NAMES = {
	PANEL:
		"mt-1 flex items-center gap-2 rounded-[4px] border border-panel-border bg-panel px-4 py-2 text-[0.95rem] font-medium [font-family:Space_Grotesk,sans-serif] whitespace-nowrap pointer-events-none",
	KEY_BASE:
		"inline-flex h-8 min-w-8 items-center justify-center rounded-[3px] px-2 text-[0.9rem] font-bold",
	INTERACT_KEY:
		"border border-dungeon-gold bg-[color-mix(in_srgb,var(--dungeon-gold)_10%,transparent)] text-dungeon-gold",
	ATTACK_KEY:
		"border border-success bg-[color-mix(in_srgb,var(--success)_10%,transparent)] text-success",
} as const;
