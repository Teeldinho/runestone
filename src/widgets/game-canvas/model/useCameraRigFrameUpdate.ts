import { useFrame } from "@react-three/fiber";

import {
	type CameraRigFrameUpdateInput,
	type PointerLockControlsHandle,
	runCameraRigFrameUpdate,
} from "../lib";

type UseCameraRigFrameUpdateInput = CameraRigFrameUpdateInput;

export const useCameraRigFrameUpdate = (
	input: UseCameraRigFrameUpdateInput,
): void => {
	useFrame(() => {
		runCameraRigFrameUpdate(input);
	});
};

export type { PointerLockControlsHandle, UseCameraRigFrameUpdateInput };
