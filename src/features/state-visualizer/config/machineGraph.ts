import type { StateVisualizerSectionId } from "../model/types";

export const MACHINE_GRAPH_LAYOUT = {
	DIRECTION: "LR",
	NODE_WIDTH: 160,
	NODE_HEIGHT: 60,
	NODE_SEPARATION: 80,
	RANK_SEPARATION: 120,
} as const;

export const STATE_VISUALIZER_SECTIONS: Array<{
	id: StateVisualizerSectionId;
	label: string;
}> = [
	{ id: "dungeon", label: "Dungeon" },
	{ id: "camera", label: "Camera" },
	{ id: "audio", label: "Audio" },
	{ id: "player", label: "Player" },
] as const;

export const STATE_VISUALIZER_DEFAULT_OPEN_SECTION: StateVisualizerSectionId =
	"dungeon";
