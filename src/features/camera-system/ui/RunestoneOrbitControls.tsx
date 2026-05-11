import { OrbitControls } from "@react-three/drei";
import type { RefObject } from "react";
import type { Group } from "three";

import type { CameraRuntimeSnapshot } from "../model/useRunestoneOrbitControls";
import { useRunestoneOrbitControls } from "../model/useRunestoneOrbitControls";

type RunestoneOrbitControlsProps = {
	readonly playerRef: RefObject<Group | null>;
	readonly cameraSnapshot: CameraRuntimeSnapshot;
};

export function RunestoneOrbitControls(props: RunestoneOrbitControlsProps) {
	const orbitControls = useRunestoneOrbitControls(props);

	if (!orbitControls.shouldRender) {
		return null;
	}

	return (
		<OrbitControls
			ref={orbitControls.controlsRef}
			makeDefault
			enableDamping={orbitControls.enableDamping}
			enablePan={orbitControls.enablePan}
			enableRotate={orbitControls.enableRotate}
			enableZoom={orbitControls.enableZoom}
			minDistance={orbitControls.minDistance}
			maxDistance={orbitControls.maxDistance}
			minPolarAngle={orbitControls.minPolarAngle}
			maxPolarAngle={orbitControls.maxPolarAngle}
		/>
	);
}

export type { RunestoneOrbitControlsProps };
