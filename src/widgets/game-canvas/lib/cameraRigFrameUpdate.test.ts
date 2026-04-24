import { beforeEach, describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";

import { CAMERA_RIG_LERP_ALPHA } from "../config";

import {
	checkShouldSyncMovementAzimuth,
	resolveCameraRigFrameFlags,
	resolveTrackedPlayerPosition,
} from "./cameraRigFrameUpdateState";

const mockGetPlayerPosition = vi.fn();
const mockHasPlayerPosition = vi.fn();

vi.mock("@/shared/lib", async (importOriginal) => {
	const original = await importOriginal<typeof import("@/shared/lib")>();

	return {
		...original,
		getPlayerPosition: () => mockGetPlayerPosition(),
		hasPlayerPosition: () => mockHasPlayerPosition(),
	};
});

describe("cameraRigFrameUpdate", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockHasPlayerPosition.mockReturnValue(false);
		mockGetPlayerPosition.mockReturnValue([0, 0, 0]);
	});

	describe("resolveTrackedPlayerPosition", () => {
		it("falls back to the spawn position when no tracked player position exists", () => {
			expect(
				resolveTrackedPlayerPosition({
					playerSpawnPosition: [10, 0.9, -5],
				}),
			).toEqual([10, 0.9, -5]);
		});

		it("returns the tracked player position when one is available", () => {
			mockHasPlayerPosition.mockReturnValue(true);
			mockGetPlayerPosition.mockReturnValue([3, 0.9, -7]);

			expect(
				resolveTrackedPlayerPosition({
					playerSpawnPosition: [10, 0.9, -5],
				}),
			).toEqual([3, 0.9, -7]);
		});
	});

	describe("checkShouldSyncMovementAzimuth", () => {
		it("always syncs movement azimuth outside free-orbital mode", () => {
			expect(
				checkShouldSyncMovementAzimuth({
					isModeChange: false,
					isUserInteracting: false,
					mode: CAMERA_MODES.THIRD_PERSON,
					needsFreeOrbitalSync: false,
				}),
			).toBe(true);
		});

		it("skips free-orbital azimuth sync when the camera is auto-following", () => {
			expect(
				checkShouldSyncMovementAzimuth({
					isModeChange: false,
					isUserInteracting: false,
					mode: CAMERA_MODES.FREE_ORBITAL,
					needsFreeOrbitalSync: false,
				}),
			).toBe(false);
		});

		it("syncs free-orbital azimuth during mode changes and user interaction", () => {
			expect(
				checkShouldSyncMovementAzimuth({
					isModeChange: true,
					isUserInteracting: false,
					mode: CAMERA_MODES.FREE_ORBITAL,
					needsFreeOrbitalSync: false,
				}),
			).toBe(true);
			expect(
				checkShouldSyncMovementAzimuth({
					isModeChange: false,
					isUserInteracting: true,
					mode: CAMERA_MODES.FREE_ORBITAL,
					needsFreeOrbitalSync: false,
				}),
			).toBe(true);
		});
	});

	describe("resolveCameraRigFrameFlags", () => {
		it("forces immediate transition alpha during camera mode changes", () => {
			const flags = resolveCameraRigFrameFlags({
				isUserInteracting: false,
				mode: CAMERA_MODES.TOP_DOWN,
				needsFreeOrbitalSync: false,
				needsThirdPersonSync: false,
				previousMode: CAMERA_MODES.FREE_ORBITAL,
				previousTrackedPlayerPosition: [0, 0, 0],
				trackedPlayerPosition: [10, 0, 0],
			});

			expect(flags.isModeChange).toBe(true);
			expect(flags.transitionAlpha).toBe(1);
			expect(flags.isFreeOrbitalJump).toBe(false);
			expect(flags.isThirdPersonJump).toBe(false);
		});

		it("detects large free-orbital jump corrections only when follow sync is idle", () => {
			const flags = resolveCameraRigFrameFlags({
				isUserInteracting: false,
				mode: CAMERA_MODES.FREE_ORBITAL,
				needsFreeOrbitalSync: false,
				needsThirdPersonSync: false,
				previousMode: CAMERA_MODES.FREE_ORBITAL,
				previousTrackedPlayerPosition: [0, 0, 0],
				trackedPlayerPosition: [10, 0, 0],
			});

			expect(flags.isModeChange).toBe(false);
			expect(flags.transitionAlpha).toBe(CAMERA_RIG_LERP_ALPHA);
			expect(flags.isFreeOrbitalJump).toBe(true);
			expect(flags.isThirdPersonJump).toBe(false);
		});

		it("detects large third-person jump corrections only when sync is idle", () => {
			const flags = resolveCameraRigFrameFlags({
				isUserInteracting: false,
				mode: CAMERA_MODES.THIRD_PERSON,
				needsFreeOrbitalSync: false,
				needsThirdPersonSync: false,
				previousMode: CAMERA_MODES.THIRD_PERSON,
				previousTrackedPlayerPosition: [0, 0, 0],
				trackedPlayerPosition: [10, 0, 0],
			});

			expect(flags.isModeChange).toBe(false);
			expect(flags.isThirdPersonJump).toBe(true);
			expect(flags.isFreeOrbitalJump).toBe(false);
		});
	});
});
