import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";

import {
	CAMERA_MODES,
	type CameraStateSnapshot,
	resolveCameraAzimuth,
} from "@/features/camera-system";
import { setCameraMode } from "@/shared/lib/cameraModeStore";
import { setCameraAzimuth } from "@/shared/lib/cameraOrientationStore";
import {
	getPlayerPosition,
	hasPlayerPosition,
} from "@/shared/lib/playerPositionStore";
import type { Vector3Tuple } from "@/shared/types";

import {
	CAMERA_RIG_CAMERA_UP,
	CAMERA_RIG_FREE_ORBITAL_RECENTER_DISTANCE,
	CAMERA_RIG_LERP_ALPHA,
} from "../config";
import type { OrbitControlsHandle } from "../lib";
import {
	getCameraRigTargets,
	getPreservedOrbitCameraPosition,
	setCameraUp,
	setOrbitTarget,
} from "../lib";

type PointerLockControlsHandle = {
	isLocked: boolean;
};

type UseCameraRigViewModelInput = {
	cameraStateSnapshot?: CameraStateSnapshot;
	playerSpawnPosition: Vector3Tuple;
};

type UseCameraRigViewModelResult = {
	controlKey: string | undefined;
	freeOrbitalOrbitRef: RefObject<OrbitControlsHandle | null>;
	handleFirstPersonLock: () => void;
	handleFirstPersonUnlock: () => void;
	mode: CameraStateSnapshot["mode"] | undefined;
	pointerLockRef: RefObject<PointerLockControlsHandle | null>;
	thirdPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
};

export const useCameraRigViewModel = ({
	cameraStateSnapshot,
	playerSpawnPosition,
}: UseCameraRigViewModelInput): UseCameraRigViewModelResult => {
	const { camera } = useThree();
	const mode = cameraStateSnapshot?.mode;
	const perspectiveCamera = camera as THREE.PerspectiveCamera;
	const previousModeRef = useRef<string | undefined>(undefined);
	const pointerLockRef = useRef<PointerLockControlsHandle>(null);
	const thirdPersonOrbitRef = useRef<OrbitControlsHandle>(null);
	const freeOrbitalOrbitRef = useRef<OrbitControlsHandle>(null);
	const needsFreeOrbitalSyncRef = useRef(false);
	const needsThirdPersonSyncRef = useRef(false);

	useEffect(() => {
		if (!mode) {
			return;
		}

		setCameraMode(mode);
	}, [mode]);

	useEffect(() => {
		if (!mode) {
			return;
		}

		needsThirdPersonSyncRef.current = mode === CAMERA_MODES.THIRD_PERSON;
		needsFreeOrbitalSyncRef.current = mode === CAMERA_MODES.FREE_ORBITAL;
	}, [mode]);

	const handleFirstPersonLock = useCallback(() => {}, []);
	const handleFirstPersonUnlock = useCallback(() => {}, []);

	useFrame(() => {
		if (!cameraStateSnapshot) {
			return;
		}

		const trackedPlayerPosition = hasPlayerPosition()
			? getPlayerPosition()
			: playerSpawnPosition;
		const { lookAt, position } = getCameraRigTargets({
			mode: cameraStateSnapshot.mode,
			playerPosition: trackedPlayerPosition,
		});
		const isModeChange = cameraStateSnapshot.mode !== previousModeRef.current;
		const transitionAlpha = isModeChange ? 1 : CAMERA_RIG_LERP_ALPHA;

		previousModeRef.current = cameraStateSnapshot.mode;

		if (cameraStateSnapshot.mode === CAMERA_MODES.TOP_DOWN) {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.TOP_DOWN);
			camera.position.set(...position);
			camera.lookAt(...lookAt);
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON) {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);
			camera.position.lerp(new THREE.Vector3(...position), transitionAlpha);
			if (!pointerLockRef.current?.isLocked) {
				camera.lookAt(...lookAt);
			}
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.THIRD_PERSON) {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);
			if (!thirdPersonOrbitRef.current) {
				if (isModeChange) {
					camera.position.set(...position);
				}
			} else if (needsThirdPersonSyncRef.current) {
				camera.position.set(...position);
				setOrbitTarget(thirdPersonOrbitRef.current, lookAt);
				needsThirdPersonSyncRef.current = false;
			} else {
				const desiredCameraPosition = getPreservedOrbitCameraPosition({
					cameraPosition: camera.position.toArray() as Vector3Tuple,
					currentTarget:
						thirdPersonOrbitRef.current.target.toArray() as Vector3Tuple,
					nextTarget: lookAt,
				});

				thirdPersonOrbitRef.current.target.lerp(
					new THREE.Vector3(...lookAt),
					CAMERA_RIG_LERP_ALPHA,
				);
				camera.position.lerp(
					new THREE.Vector3(...desiredCameraPosition),
					CAMERA_RIG_LERP_ALPHA,
				);
				thirdPersonOrbitRef.current.update();
			}
		} else if (!freeOrbitalOrbitRef.current) {
			if (isModeChange) {
				setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);
				camera.position.set(...position);
			}
		} else if (needsFreeOrbitalSyncRef.current) {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);
			camera.position.set(...position);
			setOrbitTarget(freeOrbitalOrbitRef.current, lookAt);
			needsFreeOrbitalSyncRef.current = false;
		} else {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);

			const nextTarget = new THREE.Vector3(...lookAt);
			if (
				freeOrbitalOrbitRef.current.target.distanceTo(nextTarget) >=
				CAMERA_RIG_FREE_ORBITAL_RECENTER_DISTANCE
			) {
				const desiredCameraPosition = getPreservedOrbitCameraPosition({
					cameraPosition: camera.position.toArray() as Vector3Tuple,
					currentTarget:
						freeOrbitalOrbitRef.current.target.toArray() as Vector3Tuple,
					nextTarget: lookAt,
				});

				freeOrbitalOrbitRef.current.target.lerp(
					nextTarget,
					CAMERA_RIG_LERP_ALPHA,
				);
				camera.position.lerp(
					new THREE.Vector3(...desiredCameraPosition),
					CAMERA_RIG_LERP_ALPHA,
				);
				freeOrbitalOrbitRef.current.update();
			}
		}

		const direction = new THREE.Vector3();
		camera.getWorldDirection(direction);
		const nextAzimuth = resolveCameraAzimuth({
			mode: cameraStateSnapshot.mode,
			direction,
		});
		if (nextAzimuth !== null) {
			setCameraAzimuth(nextAzimuth);
		}

		const fovDiff = Math.abs(perspectiveCamera.fov - cameraStateSnapshot.fov);
		if (fovDiff > 0.01) {
			perspectiveCamera.fov +=
				(cameraStateSnapshot.fov - perspectiveCamera.fov) * transitionAlpha;
			perspectiveCamera.updateProjectionMatrix();
		}
	});

	return {
		controlKey: cameraStateSnapshot?.mode,
		freeOrbitalOrbitRef,
		handleFirstPersonLock,
		handleFirstPersonUnlock,
		mode,
		pointerLockRef,
		thirdPersonOrbitRef,
	};
};

export type {
	OrbitControlsHandle,
	PointerLockControlsHandle,
	UseCameraRigViewModelInput,
	UseCameraRigViewModelResult,
};
