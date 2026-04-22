// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockIsDesktopLayout = vi.fn();

vi.mock("@/features/responsive-layout", () => ({
	useResponsiveGameLayout: () => ({ isDesktopLayout: mockIsDesktopLayout() }),
}));

import { useCameraRigRuntimeState } from "./useCameraRigRuntimeState";

describe("useCameraRigRuntimeState", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockIsDesktopLayout.mockReturnValue(true);
	});

	it("creates grouped refs, sync flags, and layout state", () => {
		mockIsDesktopLayout.mockReturnValue(false);

		const { result } = renderHook(() => useCameraRigRuntimeState());

		expect(result.current.isDesktopLayout).toBe(false);
		expect(result.current.refs.freeOrbitalOrbitRef.current).toBeNull();
		expect(result.current.refs.firstPersonOrbitRef.current).toBeNull();
		expect(result.current.refs.pointerLockRef.current).toBeNull();
		expect(result.current.syncFlags.needsFreeOrbitalSyncRef.current).toBe(
			false,
		);
		expect(result.current.syncFlags.needsFirstPersonSyncRef.current).toBe(
			false,
		);
		expect(result.current.interaction.isUserInteractingRef.current).toBe(false);
		expect(result.current.previousTrackedPlayerPositionRef.current).toBeNull();
	});
});
