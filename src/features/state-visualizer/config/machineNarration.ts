import { FLOOR_ONE_GUARD_KEYS, ROOM_IDS } from "@/entities/dungeon";

import type { StateVisualizerSectionId } from "../model";

export const STATE_VISUALIZER_DETAILS_COPY = {
	ACTIVE_STATE_LABEL: "Current state",
	ACTIVE_STATE_FALLBACK: "No active state detected",
	ACTIVE_STATE_SUMMARY_PREFIX: "Current machine mode:",
	UNKNOWN_STATE_LABEL: "Unknown",
	GUARDS_LABEL: "Requirements",
	GUARDS_EMPTY: "No special requirements right now.",
	TRANSITIONS_LABEL: "Possible transitions",
	TRANSITIONS_EMPTY: "No transitions are available from this machine state.",
	TRANSITION_REQUIREMENT_PREFIX: "Requirement:",
	TRANSITION_REQUIREMENT_NONE: "No special requirement",
	TRANSITION_FLOW_PREFIX: "Flow",
} as const;

export const STATE_VISUALIZER_ERROR_MESSAGES = {
	WORKSPACE_PROVIDER_REQUIRED:
		"useStateVisualizerWorkspace must be used within StateVisualizerWorkspaceProvider",
} as const;

export const STATE_VISUALIZER_TITLE_CASE_STOP_WORDS = [
	"and",
	"or",
	"of",
	"to",
	"with",
] as const;

export const STATE_VISUALIZER_SECTION_DESCRIPTIONS: Record<
	StateVisualizerSectionId,
	string
> = {
	dungeon:
		"Tracks room progression across the floor, including locked routes and unlock conditions.",
	camera:
		"Tracks camera mode changes so traversal and visibility behaviors stay predictable.",
	audio: "Tracks music playback and mute behavior for the run.",
	player: "Tracks the player lifecycle and movement readiness.",
};

export const STATE_VISUALIZER_GUARD_LABELS = {
	[FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE]:
		"You are close enough to interact with this doorway or object",
	[FLOOR_ONE_GUARD_KEYS.CAN_PICK_UP_TREASURE_KEY]:
		"The treasure key is available to collect",
	[FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED]:
		"The guard has been defeated and the treasure key is in hand",
	[FLOOR_ONE_GUARD_KEYS.EXIT_CAN_BE_ENTERED]:
		"The treasure key has been collected",
} as const;

export const STATE_VISUALIZER_STATE_LABELS = {
	[ROOM_IDS.ENTRANCE]: "Entrance",
	[ROOM_IDS.LIBRARY]: "Library",
	[ROOM_IDS.GUARD_ROOM]: "Guard Room",
	[ROOM_IDS.TREASURY]: "Treasury",
	[ROOM_IDS.EXIT]: "Exit",
} as const;
