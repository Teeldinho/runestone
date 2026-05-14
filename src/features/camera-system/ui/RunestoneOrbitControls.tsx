import { OrbitControls } from "@react-three/drei";
import type { AnyActorRef } from "xstate";

import {
	type CameraRuntimeSnapshot,
	useRunestoneOrbitControls,
} from "../model/useRunestoneOrbitControls";

type RunestoneOrbitControlsProps = {
	readonly cameraActorRef: AnyActorRef;
	readonly cameraControlElement?: HTMLElement | null;
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
			touches={orbitControls.touches}
			domElement={orbitControls.domElement}
			onChange={orbitControls.onChange}
			onStart={orbitControls.onStart}
			onEnd={orbitControls.onEnd}
		/>
	);
}

export type { RunestoneOrbitControlsProps };
