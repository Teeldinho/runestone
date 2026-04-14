import { useCameraMachine } from "@/features/camera-system";

export const useGamePageCamera = () => {
	const {
		cameraStateSnapshot,
		handleCameraModeSwitch,
		mode: cameraMode,
	} = useCameraMachine();

	return { cameraStateSnapshot, handleCameraModeSwitch, cameraMode };
};
