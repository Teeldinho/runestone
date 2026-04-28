// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import * as THREE from "three";
import { beforeEach, describe, expect, it } from "vitest";

import { useCameraRigInteractionHandlers } from "./useCameraRigInteractionHandlers";

type MockOrbitControl = {
	enableRotate: boolean;
	target: THREE.Vector3;
	update: () => void;
};

const createOrbitRef = () => ({
	current: {
		enableRotate: true,
		target: new THREE.Vector3(),
		update: () => {},
	} as MockOrbitControl,
});

describe("useCameraRigInteractionHandlers", () => {
	beforeEach(() => {
		Object.defineProperty(window, "innerWidth", {
			value: 1000,
			configurable: true,
		});
	});

	it("disables rotation when touch starts on joystick side and re-enables it on orbit end", () => {
		const cameraControlElement = document.createElement("div");
		const isUserInteractingRef = { current: false };
		const isTouchInitiallyOnLeftRef = { current: false };
		const thirdPersonOrbitRef = createOrbitRef();
		const topDownOrbitRef = createOrbitRef();
		const freeOrbitalOrbitRef = createOrbitRef();
		const firstPersonOrbitRef = createOrbitRef();

		const { result } = renderHook(() =>
			useCameraRigInteractionHandlers({
				cameraControlElement,
				firstPersonOrbitRef,
				freeOrbitalOrbitRef,
				isTouchInitiallyOnLeftRef,
				isUserInteractingRef,
				thirdPersonOrbitRef,
				topDownOrbitRef,
			}),
		);

		act(() => {
			cameraControlElement.dispatchEvent(
				new PointerEvent("pointerdown", {
					clientX: 100,
				}),
			);
			result.current.handleOrbitStart();
		});

		expect(isUserInteractingRef.current).toBe(true);
		expect(thirdPersonOrbitRef.current?.enableRotate).toBe(false);
		expect(topDownOrbitRef.current?.enableRotate).toBe(false);
		expect(freeOrbitalOrbitRef.current?.enableRotate).toBe(false);
		expect(firstPersonOrbitRef.current?.enableRotate).toBe(false);

		act(() => {
			result.current.handleOrbitEnd();
		});

		expect(isUserInteractingRef.current).toBe(false);
		expect(thirdPersonOrbitRef.current?.enableRotate).toBe(true);
		expect(topDownOrbitRef.current?.enableRotate).toBe(true);
		expect(freeOrbitalOrbitRef.current?.enableRotate).toBe(true);
		expect(firstPersonOrbitRef.current?.enableRotate).toBe(true);
	});
});
