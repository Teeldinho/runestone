import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileJoystickModel = () => {
	const { touch } = useGamePageViewModelContext();

	return {
		handleTouchJoystickMove: touch.handleTouchJoystickMove,
		handleTouchJoystickStop: touch.handleTouchJoystickStop,
	};
};
