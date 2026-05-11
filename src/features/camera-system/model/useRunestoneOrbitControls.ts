import { useFrame, useThree } from "@react-three/fiber";
import type { RefObject } from "react";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

import { CAMERA_LIMITS, type CameraModeId } from "../config";
import {
	resolveCameraPolarLimits,
	resolveOrbitControlModePolicy,
	shouldRenderOrbitControls,
	syncOrbitControlsDistance,
	syncOrbitControlsTarget,
} from "../lib";

export type CameraRuntimeSnapshot = {
	readonly mode: CameraModeId;
	readonly distance: number;
};

type UseRunestoneOrbitControlsInput = {
	readonly playerRef: RefObject<Group | null>;
	readonly cameraSnapshot: CameraRuntimeSnapshot;
};

export const useRunestoneOrbitControls = ({
	playerRef,
	cameraSnapshot,
}: UseRunestoneOrbitControlsInput) => {
	const controlsRef = useRef<OrbitControlsImpl | null>(null);
	const { camera } = useThree();

	const shouldRender = shouldRenderOrbitControls(cameraSnapshot.mode);

	const modePolicy = useMemo(
		() => resolveOrbitControlModePolicy(cameraSnapshot.mode),
		[cameraSnapshot.mode],
	);

	const polarLimits = useMemo(
		() => resolveCameraPolarLimits(cameraSnapshot.mode),
		[cameraSnapshot.mode],
	);

	useFrame(() => {
		const controls = controlsRef.current;
		const player = playerRef.current;

		if (!controls || !player) {
			return;
		}

		syncOrbitControlsTarget({
			controls,
			targetObject: player,
		});

		syncOrbitControlsDistance({
			camera,
			target: controls.target,
			desiredDistance: cameraSnapshot.distance,
		});

		controls.update();
	});

	return {
		shouldRender,
		controlsRef,

		enableDamping: true,
		enablePan: modePolicy.enablePan,
		enableRotate: modePolicy.enableRotate,
		enableZoom: modePolicy.enableZoom,

		minDistance: CAMERA_LIMITS.MIN_DISTANCE,
		maxDistance: CAMERA_LIMITS.MAX_DISTANCE,

		minPolarAngle: polarLimits.minPolarAngle,
		maxPolarAngle: polarLimits.maxPolarAngle,
	};
};
