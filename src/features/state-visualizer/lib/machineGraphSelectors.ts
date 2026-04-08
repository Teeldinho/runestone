import { ROOM_LABELS } from "@/entities/dungeon";

import type { StateVisualizerSectionId } from "../model/types";

const formatSegmentLabel = (segment: string): string => {
	return segment
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/[._-]/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.replace(/^./, (char) => char.toUpperCase());
};

export const getMachineGraphNodeLabel = (
	sectionId: StateVisualizerSectionId,
	stateNodeKey: string,
): string => {
	if (sectionId === "dungeon") {
		return (
			ROOM_LABELS[stateNodeKey as keyof typeof ROOM_LABELS] ??
			formatSegmentLabel(stateNodeKey)
		);
	}

	return formatSegmentLabel(stateNodeKey);
};

export const formatMachineStateLabel = (stateLabel: string): string => {
	return formatSegmentLabel(stateLabel);
};
