import type {
	CameraRuntimeSnapshot,
	RunestoneOrbitControlsProps,
} from "@/features/camera-system";
import { RunestoneOrbitControls } from "@/features/camera-system";

type CameraRigProps = {
	cameraActorRef: RunestoneOrbitControlsProps["cameraActorRef"];
	cameraControlElement?: HTMLElement | null;
	cameraSnapshot: CameraRuntimeSnapshot;
};

export function CameraRig({
	cameraActorRef,
	cameraControlElement,
	cameraSnapshot,
}: CameraRigProps) {
	return (
		<RunestoneOrbitControls
			cameraActorRef={cameraActorRef}
			cameraControlElement={cameraControlElement}
			cameraSnapshot={cameraSnapshot}
		/>
	);
}
