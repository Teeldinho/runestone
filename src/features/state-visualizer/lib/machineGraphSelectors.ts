import {
	STATE_VISUALIZER_GUARD_LABELS,
	STATE_VISUALIZER_SECTION_IDS,
	STATE_VISUALIZER_STATE_LABELS,
	STATE_VISUALIZER_TITLE_CASE_STOP_WORDS,
} from "../config";

import type { StateVisualizerSectionId } from "../model/types";

const splitMachineToken = (segment: string): string[] => {
	return segment
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/[._-]/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.split(" ")
		.filter(Boolean);
};

const formatTitleCaseWord = (word: string, index: number): string => {
	const lowerCaseWord = word.toLowerCase();

	if (
		index > 0 &&
		STATE_VISUALIZER_TITLE_CASE_STOP_WORDS.includes(
			lowerCaseWord as (typeof STATE_VISUALIZER_TITLE_CASE_STOP_WORDS)[number],
		)
	) {
		return lowerCaseWord;
	}

	return `${lowerCaseWord.charAt(0).toUpperCase()}${lowerCaseWord.slice(1)}`;
};

export const formatMachineTokenLabel = (segment: string): string => {
	return splitMachineToken(segment)
		.map((word, index) => formatTitleCaseWord(word, index))
		.join(" ");
};

export const getMachineGraphNodeLabel = (
	sectionId: StateVisualizerSectionId,
	stateNodeKey: string,
): string => {
	if (sectionId === STATE_VISUALIZER_SECTION_IDS.DUNGEON) {
		return (
			STATE_VISUALIZER_STATE_LABELS[
				stateNodeKey as keyof typeof STATE_VISUALIZER_STATE_LABELS
			] ?? formatMachineTokenLabel(stateNodeKey)
		);
	}

	return formatMachineTokenLabel(stateNodeKey);
};

export const getMachineGraphTransitionEventLabel = (
	eventType: string,
): string => {
	return formatMachineTokenLabel(eventType);
};

export const getMachineGraphGuardLabel = (guardKey: string): string => {
	return (
		STATE_VISUALIZER_GUARD_LABELS[
			guardKey as keyof typeof STATE_VISUALIZER_GUARD_LABELS
		] ?? formatMachineTokenLabel(guardKey)
	);
};

export const formatMachineStateLabel = (stateLabel: string): string => {
	return formatMachineTokenLabel(stateLabel);
};
