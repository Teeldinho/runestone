import { useMemo } from "react";

import { useCameraMachine } from "./useCameraMachine";

export const useCameraSystem = () => {
	const { cameraStateSnapshot, handleCameraModeSwitch } = useCameraMachine();

	return useMemo(
		() => ({
			cameraStateSnapshot,
			handleCameraModeSwitch,
		}),
		[cameraStateSnapshot, handleCameraModeSwitch],
	);
};
