import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";

import {
	applyFirstPersonFrame,
	applyFreeOrbitalFrame,
	applyThirdPersonFrame,
	applyTopDownFrame,
} from "./cameraRigFrameUpdateModeApplications";

const createOrbitControls = () => ({
	target: new THREE.Vector3(),
	update: vi.fn(),
	enableRotate: true,
});

describe("cameraRigFrameUpdateModeApplications", () => {
	it("applies the top-down frame directly when the orbit controls are missing", () => {
		const camera = new THREE.PerspectiveCamera();
		const lookAtSpy = vi.spyOn(camera, "lookAt");

		applyTopDownFrame({
			camera,
			flags: {
				isFreeOrbitalJump: false,
				isModeChange: true,
				isThirdPersonJump: false,
				transitionAlpha: 1,
			},
			lookAt: [3, 4, 5],
			needsTopDownSyncRef: { current: false },
			position: [1, 2, 3],
			topDownOrbitRef: { current: null },
		});

		expect(camera.position.toArray()).toEqual([1, 2, 3]);
		expect(camera.up.toArray()).toEqual([0, 0, 1]);
		expect(lookAtSpy).toHaveBeenCalledWith(3, 4, 5);
	});

	it("applies the desktop first-person frame using the camera position", () => {
		const camera = new THREE.PerspectiveCamera();
		const lookAtSpy = vi.spyOn(camera, "lookAt");

		applyFirstPersonFrame({
			camera,
			flags: {
				isFreeOrbitalJump: false,
				isModeChange: false,
				isThirdPersonJump: false,
				transitionAlpha: 1,
			},
			firstPersonOrbitRef: { current: null },
			firstPersonTargetVectorRef: { current: new THREE.Vector3() },
			isDesktopLayout: true,
			needsFirstPersonSyncRef: { current: false },
			pitch: 0,
			pointerLockRef: { current: { isLocked: false } },
			position: [1, 2, 3],
			positionVectorRef: { current: new THREE.Vector3() },
			yaw: 0,
		});

		expect(camera.position.toArray()).toEqual([1, 2, 3]);
		expect(lookAtSpy).toHaveBeenCalledWith(1, 2, 4);
	});

	it("syncs the third-person orbit target when a sync is requested", () => {
		const camera = new THREE.PerspectiveCamera();
		const thirdPersonOrbitRef = { current: createOrbitControls() };

		applyThirdPersonFrame({
			camera,
			flags: {
				isFreeOrbitalJump: false,
				isModeChange: false,
				isThirdPersonJump: false,
				transitionAlpha: 0.5,
			},
			isUserInteracting: false,
			lastTransition: null,
			lookAt: [2, 3, 4],
			lookAtVectorRef: { current: new THREE.Vector3() },
			needsThirdPersonSyncRef: { current: true },
			position: [1, 2, 3],
			positionVectorRef: { current: new THREE.Vector3() },
			previousTrackedPlayerPosition: null,
			thirdPersonOrbitRef,
			trackedPlayerPosition: [0, 0, 0],
		});

		expect(camera.position.toArray()).toEqual([1, 2, 3]);
		expect(thirdPersonOrbitRef.current?.target.toArray()).toEqual([2, 3, 4]);
		expect(thirdPersonOrbitRef.current?.update).toHaveBeenCalledTimes(1);
		expect(
			thirdPersonOrbitRef.current?.target.equals(new THREE.Vector3(2, 3, 4)),
		).toBe(true);
	});

	it("preserves the third-person orbit offset while the user is actively orbiting", () => {
		const camera = new THREE.PerspectiveCamera();
		camera.position.set(0, 3, -6);
		const thirdPersonOrbitRef = { current: createOrbitControls() };
		thirdPersonOrbitRef.current.target.set(0, 1, 0);

		applyThirdPersonFrame({
			camera,
			flags: {
				isFreeOrbitalJump: false,
				isModeChange: false,
				isThirdPersonJump: false,
				transitionAlpha: 0.5,
			},
			isUserInteracting: true,
			lastTransition: null,
			lookAt: [2, 1, 0],
			lookAtVectorRef: { current: new THREE.Vector3() },
			needsThirdPersonSyncRef: { current: false },
			position: [2, 3, -6],
			positionVectorRef: { current: new THREE.Vector3() },
			previousTrackedPlayerPosition: [0, 0, 0],
			thirdPersonOrbitRef,
			trackedPlayerPosition: [2, 0, 0],
		});

		expect(camera.position.toArray()).toEqual([2, 3, -6]);
		expect(thirdPersonOrbitRef.current.target.toArray()).toEqual([2, 1, 0]);
		expect(thirdPersonOrbitRef.current.update).toHaveBeenCalledTimes(1);
	});

	it("translates the active third-person orbit by player movement delta without snapping the user target", () => {
		const camera = new THREE.PerspectiveCamera();
		camera.position.set(1, 3, -6);
		const thirdPersonOrbitRef = { current: createOrbitControls() };
		thirdPersonOrbitRef.current.target.set(0.4, 1, 0.1);

		applyThirdPersonFrame({
			camera,
			flags: {
				isFreeOrbitalJump: false,
				isModeChange: false,
				isThirdPersonJump: false,
				transitionAlpha: 0.5,
			},
			isUserInteracting: true,
			lastTransition: null,
			lookAt: [2, 1, 0],
			lookAtVectorRef: { current: new THREE.Vector3() },
			needsThirdPersonSyncRef: { current: false },
			position: [2, 3, -6],
			positionVectorRef: { current: new THREE.Vector3() },
			previousTrackedPlayerPosition: [0, 0, 0],
			thirdPersonOrbitRef,
			trackedPlayerPosition: [2, 0, 0],
		});

		expect(camera.position.toArray()).toEqual([3, 3, -6]);
		expect(thirdPersonOrbitRef.current.target.toArray()).toEqual([2.4, 1, 0.1]);
		expect(thirdPersonOrbitRef.current.update).toHaveBeenCalledTimes(1);
	});

	it("syncs the free-orbital frame when controls mount after a mode change", () => {
		const camera = new THREE.PerspectiveCamera();
		const freeOrbitalOrbitRef = { current: createOrbitControls() };
		const needsFreeOrbitalSyncRef = { current: true };

		applyFreeOrbitalFrame({
			camera,
			flags: {
				isFreeOrbitalJump: false,
				isModeChange: true,
				isThirdPersonJump: false,
				transitionAlpha: 1,
			},
			freeOrbitalOrbitRef,
			lastTransition: null,
			lookAt: [5, 6, 7],
			needsFreeOrbitalSyncRef,
			position: [1, 2, 3],
		});

		expect(camera.position.toArray()).toEqual([1, 2, 3]);
		expect(camera.up.toArray()).toEqual([0, 1, 0]);
		expect(freeOrbitalOrbitRef.current?.target.toArray()).toEqual([5, 6, 7]);
		expect(freeOrbitalOrbitRef.current?.update).toHaveBeenCalledTimes(1);
		expect(needsFreeOrbitalSyncRef.current).toBe(false);
	});
});
