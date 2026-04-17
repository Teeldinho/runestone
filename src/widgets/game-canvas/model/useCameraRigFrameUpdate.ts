import { useFrame } from "@react-three/fiber";
import type { MutableRefObject, RefObject } from "react";
import * as THREE from "three";
import type { LastTransition } from "@/entities/dungeon";
import {
	CAMERA_MODES,
	type CameraStateSnapshot,
	resolveCameraAzimuth,
} from "@/features/camera-system";
import type { Vector3Tuple } from "@/shared/lib";
import {
	getPlayerPosition,
	hasPlayerPosition,
	setCameraAzimuth,
} from "@/shared/lib";

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

type UseCameraRigFrameUpdateInput = {
	camera: THREE.Camera;
	cameraStateSnapshot?: CameraStateSnapshot;
	directionRef: MutableRefObject<THREE.Vector3>;
	firstPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	firstPersonTargetVectorRef: MutableRefObject<THREE.Vector3>;
	freeOrbitalOrbitRef: RefObject<OrbitControlsHandle | null>;
	isDesktopLayout: boolean;
	isUserInteractingRef: MutableRefObject<boolean>;
	lastTransition: LastTransition | null;
	lookAtVectorRef: MutableRefObject<THREE.Vector3>;
	needsFirstPersonSyncRef: MutableRefObject<boolean>;
	needsFreeOrbitalSyncRef: MutableRefObject<boolean>;
	needsThirdPersonSyncRef: MutableRefObject<boolean>;
	needsTopDownSyncRef: MutableRefObject<boolean>;
	pointerLockRef: RefObject<PointerLockControlsHandle | null>;
	playerSpawnPosition: Vector3Tuple;
	positionVectorRef: MutableRefObject<THREE.Vector3>;
	previousModeRef: MutableRefObject<string | undefined>;
	previousTrackedPlayerPositionRef: MutableRefObject<Vector3Tuple | null>;
	thirdPersonOrbitRef: RefObject<OrbitControlsHandle | null>;
	topDownOrbitRef: RefObject<OrbitControlsHandle | null>;
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

export const useCameraRigFrameUpdate = ({
	camera,
	cameraStateSnapshot,
	directionRef,
	firstPersonOrbitRef,
	firstPersonTargetVectorRef,
	freeOrbitalOrbitRef,
	isDesktopLayout,
	isUserInteractingRef,
	lastTransition,
	lookAtVectorRef,
	needsFirstPersonSyncRef,
	needsFreeOrbitalSyncRef,
	needsThirdPersonSyncRef,
	needsTopDownSyncRef,
	pointerLockRef,
	playerSpawnPosition,
	positionVectorRef,
	previousModeRef,
	previousTrackedPlayerPositionRef,
	thirdPersonOrbitRef,
	topDownOrbitRef,
}: UseCameraRigFrameUpdateInput): void => {
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
				topDownOrbitRef.current.target.set(...lookAt);
			}
		} else if (cameraStateSnapshot.mode === CAMERA_MODES.FIRST_PERSON) {
			setCameraUp(camera, CAMERA_RIG_CAMERA_UP.DEFAULT);
			if (!isDesktopLayout && firstPersonOrbitRef.current) {
				if (needsFirstPersonSyncRef.current || isModeChange) {
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
					camera.position.set(...position);
					camera.getWorldDirection(firstPersonTargetVectorRef.current);
					firstPersonTargetVectorRef.current
						.multiplyScalar(0.01)
						.add(camera.position);
					firstPersonOrbitRef.current.target.copy(
						firstPersonTargetVectorRef.current,
					);
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
};

export type { PointerLockControlsHandle, UseCameraRigFrameUpdateInput };
