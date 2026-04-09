// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { STATE_VISUALIZER_SECTION_IDS } from "../config";

import {
	StateVisualizerWorkspaceProvider,
	useStateVisualizerWorkspace,
} from "./useStateVisualizerWorkspace";

describe("useStateVisualizerWorkspace", () => {
	it("starts with the default section and updates selection", () => {
		const wrapper = ({ children }: { children: ReactNode }) => (
			<StateVisualizerWorkspaceProvider>
				{children}
			</StateVisualizerWorkspaceProvider>
		);

		const { result } = renderHook(() => useStateVisualizerWorkspace(), {
			wrapper,
		});

		expect(result.current.selectedSectionId).toBe(
			STATE_VISUALIZER_SECTION_IDS.DUNGEON,
		);

		act(() => {
			result.current.handleSelectedSectionIdChange(
				STATE_VISUALIZER_SECTION_IDS.CAMERA,
			);
		});

		expect(result.current.selectedSectionId).toBe(
			STATE_VISUALIZER_SECTION_IDS.CAMERA,
		);
	});
});
