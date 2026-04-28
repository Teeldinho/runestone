import { describe, expect, it } from "vitest";
import { rotateVelocityByCameraAzimuth } from "@/entities/player";
import { TOP_DOWN_CAMERA_LOCKED_AZIMUTH_ANGLE } from "@/shared/config";
import { CAMERA_MODES } from "../config";
import { resolveCameraAzimuth } from "./resolveCameraAzimuth";

describe("resolveCameraAzimuth", () => {
	it("returns the locked top-down azimuth from shared camera config", () => {
		expect(
			resolveCameraAzimuth({
				mode: CAMERA_MODES.TOP_DOWN,
				direction: { x: 0, y: -1, z: 0 },
			}),
		).toBe(TOP_DOWN_CAMERA_LOCKED_AZIMUTH_ANGLE);
	});

	it("derives azimuth from the camera direction for orbital modes", () => {
		expect(
			resolveCameraAzimuth({
				mode: CAMERA_MODES.FREE_ORBITAL,
				direction: { x: 1, y: 0, z: 0 },
			}),
		).toBeCloseTo(Math.PI / 2, 6);
	});

	it("returns null when no horizontal direction can be derived", () => {
		expect(
			resolveCameraAzimuth({
				mode: CAMERA_MODES.THIRD_PERSON,
				direction: { x: 0, y: 1, z: 0 },
			}),
		).toBeNull();
	});

	it("keeps default free-orbital forward mapped to world forward on startup", () => {
		const azimuth = resolveCameraAzimuth({
			mode: CAMERA_MODES.FREE_ORBITAL,
			direction: { x: 0, y: -0.7, z: -0.7 },
		});

		expect(rotateVelocityByCameraAzimuth([0, 0, -1], azimuth ?? 0)).toEqual([
			0, 0, -1,
		]);
	});

	it("keeps top-down forward input aligned to forward world velocity", () => {
		const azimuth = resolveCameraAzimuth({
			mode: CAMERA_MODES.TOP_DOWN,
			direction: { x: 0, y: -1, z: 0 },
		});

		expect(rotateVelocityByCameraAzimuth([0, 0, 1], azimuth ?? 0)).toEqual([
			0, 0, 1,
		]);
	});
});
