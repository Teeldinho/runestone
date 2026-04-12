import type React from "react";
import { ENEMY_SPAWN_HEIGHT_OFFSET } from "@/entities/enemy";
import { ROOM_ENTITY_CONFIG } from "@/entities/room";

export const WORLD_INTERACTION_PROMPT_CONFIG = {
	DISTANCE_FACTOR: 10,
	DOOR_HEIGHT: ROOM_ENTITY_CONFIG.DOORWAY_GATE.POSITION_Y,
	ENEMY_HEIGHT_OFFSET: ENEMY_SPAWN_HEIGHT_OFFSET + 0.45,
	KEY_HEIGHT: ROOM_ENTITY_CONFIG.TREASURE_KEY.HEIGHT + 1.35,
} as const;

export const WORLD_INTERACTION_PROMPT_STYLE: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	padding: "0.375rem 0.75rem",
	fontSize: "0.8rem",
	fontFamily: "Space Grotesk, sans-serif",
	fontWeight: 500,
	borderRadius: "4px",
	border: "1px solid var(--panel-border)",
	background: "var(--panel)",
	color: "var(--foreground)",
	pointerEvents: "none",
	whiteSpace: "nowrap",
	marginTop: "0.25rem",
};

export const WORLD_INTERACTION_KEY_STYLE: React.CSSProperties = {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: "1.5rem",
	height: "1.5rem",
	padding: "0 0.375rem",
	fontSize: "0.7rem",
	fontWeight: 700,
	borderRadius: "3px",
	border: "1px solid var(--dungeon-gold)",
	color: "var(--dungeon-gold)",
	background: "color-mix(in srgb, var(--dungeon-gold) 10%, transparent)",
};
