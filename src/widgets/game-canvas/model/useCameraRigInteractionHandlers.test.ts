// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useCameraRigInteractionHandlers } from "./useCameraRigInteractionHandlers";

describe("useCameraRigInteractionHandlers", () => {
	it("marks the camera rig as interacting while orbiting and clears it on end", () => {
		const isUserInteractingRef = { current: false };

		const { result } = renderHook(() =>
			useCameraRigInteractionHandlers({
				isUserInteractingRef,
			}),
		);

		act(() => {
			result.current.handleOrbitStart();
		});

		expect(isUserInteractingRef.current).toBe(true);

		act(() => {
			result.current.handleOrbitEnd();
		});

		expect(isUserInteractingRef.current).toBe(false);
	});

	it("exposes first-person lock handlers without extra touch gating state", () => {
		const isUserInteractingRef = { current: false };

		const { result } = renderHook(() =>
			useCameraRigInteractionHandlers({
				isUserInteractingRef,
			}),
		);

		expect(typeof result.current.handleFirstPersonLock).toBe("function");
		expect(typeof result.current.handleFirstPersonUnlock).toBe("function");
	});
});
