// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DUNGEON_THEME } from "@/entities/dungeon";

import type { CanvasLightingSettings } from "./useCanvasSettings";

import { useSceneLighting } from "./useSceneLighting";

const LIGHTING_FIXTURE: CanvasLightingSettings = {
	ambient: {
		color: DUNGEON_THEME.FOG.COLOR,
		intensity: 0.25,
	},
	torch: {
		color: DUNGEON_THEME.LIGHTING.TORCH_COLOR,
		decay: 2,
		distance: 6,
		intensity: 2.5,
		positions: [
			[-1, 2, -3],
			[1, 2, 3],
		],
	},
};

describe("useSceneLighting", () => {
	it("returns mapped torch settings for rendering", () => {
		const { result } = renderHook(() => useSceneLighting(LIGHTING_FIXTURE));

		expect(result.current.torchSettings).toEqual([
			{
				color: DUNGEON_THEME.LIGHTING.TORCH_COLOR,
				decay: 2,
				distance: 6,
				intensity: 2.5,
				position: [-1, 2, -3],
			},
			{
				color: DUNGEON_THEME.LIGHTING.TORCH_COLOR,
				decay: 2,
				distance: 6,
				intensity: 2.5,
				position: [1, 2, 3],
			},
		]);
	});
});
