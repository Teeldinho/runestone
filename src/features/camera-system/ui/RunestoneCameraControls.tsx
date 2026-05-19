import { CameraControls } from "@react-three/drei";

import {
	type CameraRuntimeSnapshot,
	useRunestoneCameraControls,
} from "../model/useRunestoneCameraControls";

type RunestoneCameraControlsProps = {
	readonly cameraControlElement?: HTMLElement | null;
	readonly cameraSnapshot: CameraRuntimeSnapshot;
};

export function RunestoneCameraControls({
	cameraControlElement,
	cameraSnapshot,
}: RunestoneCameraControlsProps) {
	const cameraControls = useRunestoneCameraControls({
		cameraControlElement,
		cameraSnapshot,
	});

	if (!cameraControls.shouldRender) {
		return null;
	}

	return (
		<CameraControls
			key={cameraControls.controlsKey}
			ref={cameraControls.controlsRef}
			makeDefault
			regress
			domElement={cameraControls.domElement}
			minDistance={cameraControls.minDistance}
			maxDistance={cameraControls.maxDistance}
			minPolarAngle={cameraControls.minPolarAngle}
			maxPolarAngle={cameraControls.maxPolarAngle}
			smoothTime={cameraControls.smoothTime}
			draggingSmoothTime={cameraControls.draggingSmoothTime}
			azimuthRotateSpeed={cameraControls.azimuthRotateSpeed}
			polarRotateSpeed={cameraControls.polarRotateSpeed}
			dollySpeed={cameraControls.dollySpeed}
			truckSpeed={cameraControls.truckSpeed}
			mouseButtons={cameraControls.mouseButtons}
			touches={cameraControls.touches}
		/>
	);
}

export type { RunestoneCameraControlsProps };
