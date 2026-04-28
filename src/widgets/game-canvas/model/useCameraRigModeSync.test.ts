// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CAMERA_MODES } from "@/features/camera-system";

import { useCameraRigModeSync } from "./useCameraRigModeSync";

const mockSetCameraMode = vi.fn();

vi.mock("@/shared/lib", () => ({
	setCameraMode: (...args: unknown[]) => mockSetCameraMode(...args),
}));

const createSyncRefs = () => ({
	needsFirstPersonSyncRef: { current: false },
	needsFreeOrbitalSyncRef: { current: false },
	needsThirdPersonSyncRef: { current: false },
	needsTopDownSyncRef: { current: false },
});

describe("useCameraRigModeSync", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("syncs camera mode store and updates mode-specific sync refs", () => {
		const syncRefs = createSyncRefs();

		renderHook(() =>
			useCameraRigModeSync({
				mode: CAMERA_MODES.TOP_DOWN,
				...syncRefs,
			}),
		);

		expect(mockSetCameraMode).toHaveBeenCalledWith(CAMERA_MODES.TOP_DOWN);
		expect(syncRefs.needsTopDownSyncRef.current).toBe(true);
		expect(syncRefs.needsThirdPersonSyncRef.current).toBe(false);
		expect(syncRefs.needsFreeOrbitalSyncRef.current).toBe(false);
		expect(syncRefs.needsFirstPersonSyncRef.current).toBe(false);
	});

	it("does not update mode store when mode is undefined", () => {
		const syncRefs = createSyncRefs();

		renderHook(() =>
			useCameraRigModeSync({
				mode: undefined,
				...syncRefs,
			}),
		);

		expect(mockSetCameraMode).not.toHaveBeenCalled();
		expect(syncRefs.needsTopDownSyncRef.current).toBe(false);
		expect(syncRefs.needsThirdPersonSyncRef.current).toBe(false);
		expect(syncRefs.needsFreeOrbitalSyncRef.current).toBe(false);
		expect(syncRefs.needsFirstPersonSyncRef.current).toBe(false);
	});
});
