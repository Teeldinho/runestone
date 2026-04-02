import { describe, expect, it } from "vitest";

import { DUNGEON_THEME } from "@/entities/dungeon";

import type { CanvasLightingSettings } from "../model/useCanvasSettings";

import { createTorchSettings } from "./createTorchSettings";

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

describe("createTorchSettings", () => {
	it("maps torch positions into torch light settings", () => {
		expect(createTorchSettings(LIGHTING_FIXTURE)).toEqual([
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
