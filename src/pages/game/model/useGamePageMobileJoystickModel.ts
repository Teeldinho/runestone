import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileJoystickModel = () => {
	const { handleTouchJoystickMove, handleTouchJoystickStop } =
		useGamePageViewModelContext();

	return {
		handleTouchJoystickMove,
		handleTouchJoystickStop,
	};
};
