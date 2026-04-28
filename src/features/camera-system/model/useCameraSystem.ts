import { useCameraMachine } from "./useCameraMachine";

export const useCameraSystem = () => {
	const { cameraStateSnapshot, handleCameraModeSwitch } = useCameraMachine();

	return {
		cameraStateSnapshot,
		handleCameraModeSwitch,
	};
};
