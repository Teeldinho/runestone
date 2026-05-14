import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { AnyActorRef } from "xstate";

import type { Vector3Tuple } from "@/shared/lib";
import {
	getPlayerPosition,
	setCameraAzimuth,
	useResponsiveLayout,
} from "@/shared/lib";
import {
	CAMERA_EVENT_TYPES,
	CAMERA_LIMITS,
	CAMERA_MODE_IDS,
	CAMERA_UP_VECTORS,
	type CameraModeId,
	ORBIT_CONTROL_TOUCH_GESTURES,
} from "../config";
import {
	resolveCameraPolarLimits,
	resolveMovementAzimuthFromCameraSnapshot,
	resolveOrbitControlDistanceLimits,
	resolveOrbitControlModePolicy,
	resolveOrbitControlsCameraPosition,
	resolveOrbitControlsSnapshot,
	resolveOrbitControlsSnapshotDiff,
	resolveOrbitControlsTargetPosition,
	shouldRenderOrbitControls,
	syncOrbitControlsDistance,
	syncOrbitControlsTarget,
} from "../lib";
import type { OrbitControlsSnapshot } from "../lib/resolveOrbitControlsSnapshotDiff";
import type { CameraStateSnapshot } from "./types";

export type CameraRuntimeSnapshot = CameraStateSnapshot;

type UseRunestoneOrbitControlsInput = {
	readonly cameraActorRef: AnyActorRef;
	readonly cameraControlElement?: HTMLElement | null;
	readonly cameraSnapshot: CameraRuntimeSnapshot;
};

type UseRunestoneOrbitControlsResult = {
	readonly controlsRef: RefObject<OrbitControlsImpl | null>;
	readonly domElement?: HTMLElement;
	readonly enableDamping: boolean;
	readonly enablePan: boolean;
	readonly enableRotate: boolean;
	readonly enableZoom: boolean;
	readonly maxDistance: number;
	readonly maxPolarAngle: number;
	readonly minDistance: number;
	readonly minPolarAngle: number;
	readonly onChange: () => void;
	readonly onEnd: () => void;
	readonly onStart: () => void;
	readonly shouldRender: boolean;
	readonly touches:
		| {
				readonly ONE: number;
				readonly TWO: number;
		  }
		| undefined;
};

const resolveCameraUpVector = (mode: CameraModeId): Vector3Tuple =>
	mode === CAMERA_MODE_IDS.TOP_DOWN
		? CAMERA_UP_VECTORS.TOP_DOWN
		: CAMERA_UP_VECTORS.DEFAULT;

export const useRunestoneOrbitControls = ({
	cameraActorRef,
	cameraControlElement,
	cameraSnapshot,
}: UseRunestoneOrbitControlsInput): UseRunestoneOrbitControlsResult => {
	const controlsRef = useRef<OrbitControlsImpl | null>(null);
	const previousModeRef = useRef<CameraModeId | undefined>(undefined);
	const isUserInteractingRef = useRef(false);
	const previousOrbitSnapshotRef = useRef<OrbitControlsSnapshot>({
		distance: cameraSnapshot.distance,
		pitch: cameraSnapshot.pitch,
		yaw: cameraSnapshot.yaw,
	});
	const { camera } = useThree();
	const { isDesktopLayout } = useResponsiveLayout();
	const shouldRender = shouldRenderOrbitControls({
		cameraControlElement,
		isDesktopLayout,
	});

	const modePolicy = useMemo(
		() => resolveOrbitControlModePolicy(cameraSnapshot.mode),
		[cameraSnapshot.mode],
	);
	const polarLimits = useMemo(
		() => resolveCameraPolarLimits(cameraSnapshot.mode),
		[cameraSnapshot.mode],
	);
	const distanceLimits = useMemo(
		() => resolveOrbitControlDistanceLimits(cameraSnapshot.mode),
		[cameraSnapshot.mode],
	);
	const touches = useMemo(
		() => ORBIT_CONTROL_TOUCH_GESTURES[cameraSnapshot.mode],
		[cameraSnapshot.mode],
	);

	useEffect(() => {
		if (!(camera instanceof THREE.PerspectiveCamera)) {
			return;
		}

		if (
			Math.abs(camera.fov - cameraSnapshot.fov) <= CAMERA_LIMITS.FOV_EPSILON
		) {
			return;
		}

		camera.fov = cameraSnapshot.fov;
		camera.updateProjectionMatrix();
	}, [camera, cameraSnapshot.fov]);

	const handleOrbitStart = useCallback(() => {
		const controls = controlsRef.current;

		if (!controls) {
			return;
		}

		isUserInteractingRef.current = true;
		previousOrbitSnapshotRef.current = resolveOrbitControlsSnapshot(controls);
	}, []);

	const handleOrbitChange = useCallback(() => {
		const controls = controlsRef.current;

		if (!controls || !isUserInteractingRef.current) {
			return;
		}

		const currentSnapshot = resolveOrbitControlsSnapshot(controls);
		const diff = resolveOrbitControlsSnapshotDiff({
			current: currentSnapshot,
			previous: previousOrbitSnapshotRef.current,
		});

		previousOrbitSnapshotRef.current = currentSnapshot;

		if (diff.hasLookDelta) {
			cameraActorRef.send({
				type: CAMERA_EVENT_TYPES.LOOK_CHANGED,
				delta: diff.lookDelta,
			});
		}

		if (diff.hasZoomDelta) {
			cameraActorRef.send({
				type: CAMERA_EVENT_TYPES.ZOOM_CHANGED,
				delta: diff.zoomDelta,
			});
		}
	}, [cameraActorRef]);

	const handleOrbitEnd = useCallback(() => {
		isUserInteractingRef.current = false;
		cameraActorRef.send({
			type: CAMERA_EVENT_TYPES.LOOK_STOPPED,
		});
	}, [cameraActorRef]);

	useFrame(() => {
		const controls = controlsRef.current;

		if (!controls) {
			return;
		}

		const playerPosition = getPlayerPosition();
		const nextTarget = resolveOrbitControlsTargetPosition({
			cameraMode: cameraSnapshot.mode,
			cameraPitch: cameraSnapshot.pitch,
			cameraYaw: cameraSnapshot.yaw,
			distance: cameraSnapshot.distance,
			playerPosition,
		});

		camera.up.set(...resolveCameraUpVector(cameraSnapshot.mode));

		if (previousModeRef.current !== cameraSnapshot.mode) {
			const nextCameraPosition = resolveOrbitControlsCameraPosition({
				cameraPosition: cameraSnapshot.position,
				currentTarget: cameraSnapshot.target,
				nextTarget,
			});

			camera.position.set(...nextCameraPosition);
			syncOrbitControlsTarget({
				controls,
				target: nextTarget,
			});
			previousModeRef.current = cameraSnapshot.mode;
		} else {
			syncOrbitControlsTarget({
				controls,
				target: nextTarget,
			});
			syncOrbitControlsDistance({
				camera,
				target: controls.target,
				desiredDistance: cameraSnapshot.distance,
			});
		}

		setCameraAzimuth(resolveMovementAzimuthFromCameraSnapshot(cameraSnapshot));
	}, -2);

	return {
		controlsRef,
		domElement: isDesktopLayout
			? undefined
			: (cameraControlElement ?? undefined),
		enableDamping: true,
		enablePan: modePolicy.enablePan,
		enableRotate: modePolicy.enableRotate,
		enableZoom: modePolicy.enableZoom,
		maxDistance: distanceLimits.maxDistance,
		maxPolarAngle: polarLimits.maxPolarAngle,
		minDistance: distanceLimits.minDistance,
		minPolarAngle: polarLimits.minPolarAngle,
		onChange: handleOrbitChange,
		onEnd: handleOrbitEnd,
		onStart: handleOrbitStart,
		shouldRender,
		touches,
	};
};

export type { UseRunestoneOrbitControlsInput, UseRunestoneOrbitControlsResult };
