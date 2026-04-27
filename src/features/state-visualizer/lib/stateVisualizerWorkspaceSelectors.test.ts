import { describe, expect, it } from "vitest";

import { STATE_VISUALIZER_SECTION_IDS } from "../config";

import {
	selectStateVisualizerWorkspaceHandleSelectedSectionIdChange,
	selectStateVisualizerWorkspaceSelectedSectionId,
	type StateVisualizerWorkspaceState,
} from "./stateVisualizerWorkspaceSelectors";

describe("stateVisualizerWorkspaceSelectors", () => {
	it("reads the selected section id", () => {
		const state: StateVisualizerWorkspaceState = {
			handleSelectedSectionIdChange: () => {},
			selectedSectionId: STATE_VISUALIZER_SECTION_IDS.CAMERA,
		};

		expect(selectStateVisualizerWorkspaceSelectedSectionId(state)).toBe(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);
	});

	it("reads the change handler", () => {
		const handleSelectedSectionIdChange = () => {};
		const state: StateVisualizerWorkspaceState = {
			handleSelectedSectionIdChange,
			selectedSectionId: STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		};

		expect(
			selectStateVisualizerWorkspaceHandleSelectedSectionIdChange(state),
		).toBe(handleSelectedSectionIdChange);
	});
});
