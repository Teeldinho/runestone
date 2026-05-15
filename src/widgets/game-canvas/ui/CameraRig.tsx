import type { CameraRuntimeSnapshot } from "@/features/camera-system";
import { RunestoneCameraControls } from "@/features/camera-system";

type CameraRigProps = {
	cameraControlElement?: HTMLElement | null;
	cameraSnapshot: CameraRuntimeSnapshot;
};

export function CameraRig({
	cameraControlElement,
	cameraSnapshot,
}: CameraRigProps) {
	return (
		<RunestoneCameraControls
			cameraControlElement={cameraControlElement}
			cameraSnapshot={cameraSnapshot}
		/>
	);
}

export type { CameraRigProps };
