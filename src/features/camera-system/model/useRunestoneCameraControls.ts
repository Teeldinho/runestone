import { useFrame, useThree } from "@react-three/fiber";
import type CameraControlsImpl from "camera-controls";
import type { RefObject } from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Vector3Tuple } from "@/shared/lib";
import {
	getPlayerPosition,
	setCameraAzimuth,
	useResponsiveLayout,
} from "@/shared/lib";
import { CAMERA_CONTROLS_CONSTANTS, type CameraModeId } from "../config";
import {
	areVector3TuplesApproximatelyEqual,
	resolveCameraControlsFollowTarget,
	resolveCameraControlsInputBindings,
	resolveCameraControlsModePolicy,
	resolveCameraControlsModePose,
	resolveCameraControlsUpAxisKey,
	resolveCameraControlsUpVector,
	resolveMovementAzimuthFromCameraControls,
	shouldRenderCameraControls,
} from "../lib";
import type { CameraStateSnapshot } from "./types";

export type CameraRuntimeSnapshot = CameraStateSnapshot;

type UseRunestoneCameraControlsInput = {
	readonly cameraControlElement?: HTMLElement | null;
	readonly cameraSnapshot: CameraRuntimeSnapshot;
};

type UseRunestoneCameraControlsResult = {
	readonly controlsKey: number;
	readonly controlsRef: RefObject<CameraControlsImpl | null>;
	readonly domElement?: HTMLElement;
	readonly shouldRender: boolean;
	readonly minDistance: number;
	readonly maxDistance: number;
	readonly minPolarAngle: number;
	readonly maxPolarAngle: number;
	readonly smoothTime: number;
	readonly draggingSmoothTime: number;
	readonly azimuthRotateSpeed: number;
	readonly polarRotateSpeed: number;
	readonly dollySpeed: number;
	readonly truckSpeed: number;
	readonly mouseButtons: ReturnType<
		typeof resolveCameraControlsInputBindings
	>["mouseButtons"];
	readonly touches: ReturnType<
		typeof resolveCameraControlsInputBindings
	>["touches"];
};

export const useRunestoneCameraControls = ({
	cameraControlElement,
	cameraSnapshot,
}: UseRunestoneCameraControlsInput): UseRunestoneCameraControlsResult => {
	const controlsRef = useRef<CameraControlsImpl | null>(null);
	const previousModeRef = useRef<CameraModeId | undefined>(undefined);
	const previousFollowTargetRef = useRef<Vector3Tuple | null>(null);
	const previousUpAxisKeyRef = useRef<string | null>(null);
	const [controlsKey, setControlsKey] = useState(0);

	const { camera } = useThree();
	const { isDesktopLayout } = useResponsiveLayout();

	const shouldRender = shouldRenderCameraControls({
		cameraControlElement,
		isDesktopLayout,
	});

	const modePolicy = useMemo(
		() => resolveCameraControlsModePolicy(cameraSnapshot.mode),
		[cameraSnapshot.mode],
	);

	const inputBindings = useMemo(
		() => resolveCameraControlsInputBindings(cameraSnapshot.mode),
		[cameraSnapshot.mode],
	);

	useLayoutEffect(() => {
		const nextUpAxisKey = resolveCameraControlsUpAxisKey(cameraSnapshot.mode);
		const nextUpVector = resolveCameraControlsUpVector(cameraSnapshot.mode);

		camera.up.set(...nextUpVector);

		if (previousUpAxisKeyRef.current === null) {
			previousUpAxisKeyRef.current = nextUpAxisKey;
			return;
		}

		if (previousUpAxisKeyRef.current !== nextUpAxisKey) {
			previousUpAxisKeyRef.current = nextUpAxisKey;
			setControlsKey((currentKey) => currentKey + 1);
		}
	}, [camera, cameraSnapshot.mode]);

	useLayoutEffect(() => {
		if (!(camera instanceof THREE.PerspectiveCamera)) {
			return;
		}

		if (
			Math.abs(camera.fov - cameraSnapshot.fov) <=
			CAMERA_CONTROLS_CONSTANTS.FOV_EPSILON
		) {
			return;
		}

		camera.fov = cameraSnapshot.fov;
		camera.updateProjectionMatrix();
	}, [camera, cameraSnapshot.fov]);

	useFrame(() => {
		const controls = controlsRef.current;

		if (!controls || !shouldRender) {
			return;
		}

		const playerPosition = getPlayerPosition();
		const followTarget = resolveCameraControlsFollowTarget({
			mode: cameraSnapshot.mode,
			playerPosition,
		});

		if (previousModeRef.current !== cameraSnapshot.mode) {
			const modePose = resolveCameraControlsModePose({
				cameraSnapshot,
				followTarget,
			});

			controls
				.normalizeRotations()
				.setLookAt(
					modePose.position[0],
					modePose.position[1],
					modePose.position[2],
					modePose.target[0],
					modePose.target[1],
					modePose.target[2],
					CAMERA_CONTROLS_CONSTANTS.MODE_TRANSITION_ENABLED,
				);

			previousModeRef.current = cameraSnapshot.mode;
			previousFollowTargetRef.current = followTarget;
		} else {
			const previousFollowTarget = previousFollowTargetRef.current;

			const hasFollowTargetChanged =
				previousFollowTarget === null ||
				!areVector3TuplesApproximatelyEqual({
					left: previousFollowTarget,
					right: followTarget,
					epsilon: CAMERA_CONTROLS_CONSTANTS.FOLLOW_TARGET_EPSILON,
				});

			if (hasFollowTargetChanged) {
				controls.moveTo(
					followTarget[0],
					followTarget[1],
					followTarget[2],
					CAMERA_CONTROLS_CONSTANTS.FOLLOW_TRANSITION_ENABLED,
				);

				previousFollowTargetRef.current = followTarget;
			}
		}

		setCameraAzimuth(
			resolveMovementAzimuthFromCameraControls({
				mode: cameraSnapshot.mode,
				azimuthAngle: controls.azimuthAngle,
			}),
		);
	}, -2);

	return {
		controlsKey,
		controlsRef,
		domElement: isDesktopLayout
			? undefined
			: (cameraControlElement ?? undefined),
		shouldRender,
		minDistance: modePolicy.minDistance,
		maxDistance: modePolicy.maxDistance,
		minPolarAngle: modePolicy.minPolarAngle,
		maxPolarAngle: modePolicy.maxPolarAngle,
		smoothTime: modePolicy.smoothTime,
		draggingSmoothTime: modePolicy.draggingSmoothTime,
		azimuthRotateSpeed: modePolicy.azimuthRotateSpeed,
		polarRotateSpeed: modePolicy.polarRotateSpeed,
		dollySpeed: modePolicy.dollySpeed,
		truckSpeed: modePolicy.truckSpeed,
		mouseButtons: inputBindings.mouseButtons,
		touches: inputBindings.touches,
	};
};

export type {
	UseRunestoneCameraControlsInput,
	UseRunestoneCameraControlsResult,
};
