import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import {
	CAMERA_MODES,
	type CameraStateSnapshot,
	resolveCameraAzimuth,
} from "@/features/camera-system";
import {
	selectLastTransition,
	useGameMachineSelector,
} from "@/features/dungeon-navigation";
import { useResponsiveGameLayout } from "@/features/responsive-layout";
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
	CAMERA_RIG_TRANSITION_JUMP_DISTANCE,
} from "../config";
import type { OrbitControlsHandle } from "../lib";
import {
	checkOrbitFollowJump,
	getCameraRigTargets,
	getPreservedOrbitCameraPosition,
	getThirdPersonTransitionTargets,
	setCameraUp,
	setOrbitTarget,
} from "../lib";

type PointerLockControlsHandle = {
	isLocked: boolean;
};

type UseCameraRigViewModelInput = {
	cameraControlElement?: HTMLElement | null;
	cameraStateSnapshot?: CameraStateSnapshot;
	playerSpawnPosition: Vector3Tuple;
};

type UseCameraRigViewModelResult = {
	controlKey: string | undefined;
	freeOrbitalOrbitRef: RefObject<OrbitControlsHandle | null>;
	handleFirstPersonLock: () => void;
	handleFirstPersonUnlock: () => void;
	handleOrbitStart: () => void;
	handleOrbitEnd: () => void;
	mode: CameraStateSnapshot["mode"] | undefined;
	pointerLockRef: RefObject<PointerLockControlsHandle | null>;
	thirdPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	topDownOrbitRef: RefObject<OrbitControlsHandle | null>;
	firstPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	isDesktopLayout: boolean;
};

const shouldSyncMovementAzimuth = ({
	isModeChange,
	isUserInteracting,
	mode,
	needsFreeOrbitalSync,
}: {
	isModeChange: boolean;
	isUserInteracting: boolean;
	mode: CameraStateSnapshot["mode"];
	needsFreeOrbitalSync: boolean;
}): boolean => {
	if (mode !== CAMERA_MODES.FREE_ORBITAL) {
		return true;
	}

	return isModeChange || needsFreeOrbitalSync || isUserInteracting;
};

export const useCameraRigViewModel = ({
	cameraControlElement,
	cameraStateSnapshot,
	playerSpawnPosition,
}: UseCameraRigViewModelInput): UseCameraRigViewModelResult => {
	const { camera } = useThree();
	const lastTransition = useGameMachineSelector(selectLastTransition);
	const mode = cameraStateSnapshot?.mode;
	const previousModeRef = useRef<string | undefined>(undefined);
	const pointerLockRef = useRef<PointerLockControlsHandle>(null);
	const thirdPersonOrbitRef = useRef<OrbitControlsHandle>(null);
	const topDownOrbitRef = useRef<OrbitControlsHandle>(null);
	const freeOrbitalOrbitRef = useRef<OrbitControlsHandle>(null);
	const firstPersonOrbitRef = useRef<OrbitControlsHandle>(null);
	const { isDesktopLayout } = useResponsiveGameLayout();
	const needsFreeOrbitalSyncRef = useRef(false);
	const needsThirdPersonSyncRef = useRef(false);
	const needsTopDownSyncRef = useRef(false);
	const needsFirstPersonSyncRef = useRef(false);
	const isUserInteractingRef = useRef(false);
	const previousTrackedPlayerPositionRef = useRef<Vector3Tuple | null>(null);
	const directionRef = useRef(new THREE.Vector3());
	const lookAtVectorRef = useRef(new THREE.Vector3());
	const positionVectorRef = useRef(new THREE.Vector3());
	const firstPersonTargetVectorRef = useRef(new THREE.Vector3());
	const isTouchInitiallyOnLeftRef = useRef(false);

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
		needsTopDownSyncRef.current = mode === CAMERA_MODES.TOP_DOWN;
		needsFirstPersonSyncRef.current = mode === CAMERA_MODES.FIRST_PERSON;
	}, [mode]);

	const handlePointerDown = useCallback((event: PointerEvent) => {
		// Detect if the touch started in the bottom-left "Movement Zone".
		// We use a generous area to match the enlarged joystick (approx 200px from corners).
		const isBottomLeft =
			event.clientX < 200 && event.clientY > window.innerHeight - 200;
		isTouchInitiallyOnLeftRef.current = isBottomLeft;
	}, []);

	useEffect(() => {
		const element = cameraControlElement;
		if (!element) {
			return;
		}

		element.addEventListener("pointerdown", handlePointerDown);
		return () => {
			element.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [cameraControlElement, handlePointerDown]);

	const handleFirstPersonLock = useCallback(() => {}, []);
	const handleFirstPersonUnlock = useCallback(() => {}, []);
	const handleOrbitStart = useCallback(() => {
		isUserInteractingRef.current = true;

		// If a single-finger interaction started in the movement zone,
		// disable rotation to prevent panning while moving.
		// Zoom (multi-finger) should still work naturally as it uses deltas between all fingers.
		[
			thirdPersonOrbitRef,
			topDownOrbitRef,
			freeOrbitalOrbitRef,
			firstPersonOrbitRef,
		].forEach((ref) => {
			if (ref.current) {
				ref.current.enableRotate = !isTouchInitiallyOnLeftRef.current;
			}
		});
	}, []);
	const handleOrbitEnd = useCallback(() => {
		isUserInteractingRef.current = false;

		// Re-enable rotation for next interaction
		[
			thirdPersonOrbitRef,
			topDownOrbitRef,
			freeOrbitalOrbitRef,
			firstPersonOrbitRef,
		].forEach((ref) => {
			if (ref.current) {
				ref.current.enableRotate = true;
			}
		});
	}, []);

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
			isDesktopLayout,
		});
		const isModeChange = cameraStateSnapshot.mode !== previousModeRef.current;
		const isFreeOrbitalJump =
			cameraStateSnapshot.mode === CAMERA_MODES.FREE_ORBITAL &&
			!isModeChange &&
			!needsFreeOrbitalSyncRef.current &&
			!isUserInteractingRef.current &&
			checkOrbitFollowJump({
				jumpDistance: CAMERA_RIG_FREE_ORBITAL_RECENTER_DISTANCE,
				nextTarget: trackedPlayerPosition,
				previousTarget: previousTrackedPlayerPositionRef.current,
			});
		const isThirdPersonJump =
			cameraStateSnapshot.mode === CAMERA_MODES.THIRD_PERSON &&
			!isModeChange &&
			!needsThirdPersonSyncRef.current &&
			checkOrbitFollowJump({
				jumpDistance: CAMERA_RIG_TRANSITION_JUMP_DISTANCE,
				nextTarget: trackedPlayerPosition,
				previousTarget: previousTrackedPlayerPositionRef.current,
			});
		const transitionAlpha = isModeChange ? 1 : CAMERA_RIG_LERP_ALPHA;

		previousModeRef.current = cameraStateSnapshot.mode;

		if (cameraStateSnapshot.mode === CAMERA_MODES.TOP_DOWN) {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.TOP_DOWN);
			if (!topDownOrbitRef.current) {
				if (isModeChange) {
					camera.position.set(...position);
					camera.lookAt(...lookAt);
				}
			} else if (needsTopDownSyncRef.current) {
				camera.position.set(...position);
				setOrbitTarget(topDownOrbitRef.current, lookAt);
				needsTopDownSyncRef.current = false;
			} else {
				// While interacting (panning/zooming), we ONLY update the orbit target.
				// We do NOT call update() or override camera.position to prevent jitter.
				topDownOrbitRef.current.target.set(...lookAt);
			}
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON) {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);
			if (!isDesktopLayout && firstPersonOrbitRef.current) {
				if (needsFirstPersonSyncRef.current || isModeChange) {
					// Snap camera to head on first mount — target is 0.01 ahead in camera forward
					camera.position.set(...position);
					camera.getWorldDirection(firstPersonTargetVectorRef.current);
					firstPersonTargetVectorRef.current
						.multiplyScalar(0.01)
						.add(camera.position);
					setOrbitTarget(firstPersonOrbitRef.current, [
						firstPersonTargetVectorRef.current.x,
						firstPersonTargetVectorRef.current.y,
						firstPersonTargetVectorRef.current.z,
					]);
					needsFirstPersonSyncRef.current = false;
				} else {
					// Every frame: snap the camera to the player's head, then keep the
					// orbit pivot exactly 0.01 m ahead in camera-space.
					camera.position.set(...position);
					camera.getWorldDirection(firstPersonTargetVectorRef.current);
					firstPersonTargetVectorRef.current
						.multiplyScalar(0.01)
						.add(camera.position);
					firstPersonOrbitRef.current.target.copy(
						firstPersonTargetVectorRef.current,
					);
					// Important: Do NOT call controls.update() or lerp here.
				}
			} else {
				positionVectorRef.current.set(...position);
				camera.position.lerp(positionVectorRef.current, transitionAlpha);
				if (!pointerLockRef.current?.isLocked) {
					camera.lookAt(
						camera.position.x,
						camera.position.y,
						camera.position.z + 1,
					);
				}
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
			} else if (isThirdPersonJump) {
				const transitionTargets = lastTransition
					? getThirdPersonTransitionTargets({
							doorSide: lastTransition.doorSide,
							playerPosition: trackedPlayerPosition,
						})
					: { position, lookAt };

				camera.position.set(...transitionTargets.position);
				setOrbitTarget(thirdPersonOrbitRef.current, transitionTargets.lookAt);
				thirdPersonOrbitRef.current.update();
			} else if (isUserInteractingRef.current) {
				// RESOLVE JITTER: During manual orbit, ONLY update the target.
				// Let OrbitControls handle all camera position and rotation changes.
				// If we manualy set camera.position here (even via lerp), we fight
				// the spherical coordinates computed by the controls, causing shaking.
				thirdPersonOrbitRef.current.target.set(...lookAt);
			} else {
				const desiredCameraPosition = getPreservedOrbitCameraPosition({
					cameraPosition: camera.position.toArray() as Vector3Tuple,
					currentTarget:
						thirdPersonOrbitRef.current.target.toArray() as Vector3Tuple,
					nextTarget: lookAt,
				});

				lookAtVectorRef.current.set(...lookAt);
				positionVectorRef.current.set(...desiredCameraPosition);

				thirdPersonOrbitRef.current.target.lerp(
					lookAtVectorRef.current,
					CAMERA_RIG_LERP_ALPHA,
				);
				camera.position.lerp(positionVectorRef.current, CAMERA_RIG_LERP_ALPHA);
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
		} else if (isFreeOrbitalJump) {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);

			// Reset camera logic: if it's a jump back to the entrance spawn (lastTransition is null),
			// force the absolute default orientation instead of preserving the old orbit.
			if (lastTransition === null) {
				camera.position.set(...position);
				setOrbitTarget(freeOrbitalOrbitRef.current, lookAt);
			} else {
				const desiredCameraPosition = getPreservedOrbitCameraPosition({
					cameraPosition: [
						camera.position.x,
						camera.position.y,
						camera.position.z,
					],
					currentTarget: [
						freeOrbitalOrbitRef.current.target.x,
						freeOrbitalOrbitRef.current.target.y,
						freeOrbitalOrbitRef.current.target.z,
					],
					nextTarget: lookAt,
				});

				camera.position.set(...desiredCameraPosition);
				setOrbitTarget(freeOrbitalOrbitRef.current, lookAt);
			}

			freeOrbitalOrbitRef.current.update();
		}

		if (
			shouldSyncMovementAzimuth({
				isModeChange,
				isUserInteracting: isUserInteractingRef.current,
				mode: cameraStateSnapshot.mode,
				needsFreeOrbitalSync: needsFreeOrbitalSyncRef.current,
			})
		) {
			camera.getWorldDirection(directionRef.current);
			const nextAzimuth = resolveCameraAzimuth({
				mode: cameraStateSnapshot.mode,
				direction: directionRef.current,
			});
			if (nextAzimuth !== null) {
				setCameraAzimuth(nextAzimuth);
			}
		}

		if (camera instanceof THREE.PerspectiveCamera) {
			const fovDiff = Math.abs(camera.fov - cameraStateSnapshot.fov);
			if (fovDiff > 0.01) {
				camera.fov += (cameraStateSnapshot.fov - camera.fov) * transitionAlpha;
				camera.updateProjectionMatrix();
			}
		}

		previousTrackedPlayerPositionRef.current = [...trackedPlayerPosition];
	});

	return {
		controlKey: cameraStateSnapshot?.mode,
		freeOrbitalOrbitRef,
		handleFirstPersonLock,
		handleFirstPersonUnlock,
		handleOrbitEnd,
		handleOrbitStart,
		mode,
		pointerLockRef,
		thirdPersonOrbitRef,
		topDownOrbitRef,
		firstPersonOrbitRef,
		isDesktopLayout,
	};
};

export type {
	OrbitControlsHandle,
	PointerLockControlsHandle,
	UseCameraRigViewModelInput,
	UseCameraRigViewModelResult,
};
