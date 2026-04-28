import { useGamePageTouchContext } from "./useGamePageSliceContexts";

export const useGamePageMobileJoystickModel = () => {
	const touch = useGamePageTouchContext();

	return {
		handleTouchJoystickMove: touch.handleTouchJoystickMove,
		handleTouchJoystickStop: touch.handleTouchJoystickStop,
	};
};
