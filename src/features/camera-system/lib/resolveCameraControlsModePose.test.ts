import { describe, expect, it } from "vitest";

import { CAMERA_MODES } from "../config";
import { resolveCameraControlsModePose } from "./resolveCameraControlsModePose";

describe("resolveCameraControlsModePose", () => {
	it("preserves the preset offset relative to the new follow target", () => {
		expect(
			resolveCameraControlsModePose({
				cameraSnapshot: {
					fov: 58,
					mode: CAMERA_MODES.FREE_ORBITAL,
					position: [10, 5, -2],
					target: [2, 1, -4],
					zoom: 1,
					yaw: 0,
					pitch: 0,
					distance: 6,
				},
				followTarget: [6, 7, 8],
			}),
		).toEqual({
			position: [14, 11, 10],
			target: [6, 7, 8],
		});
	});
});
