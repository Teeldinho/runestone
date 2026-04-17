import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileTopBarModel = () => {
	const {
		cameraStateSnapshot,
		handleCameraModeSwitch,
		handleDungeonRunReset,
		playerHp,
		playerMaxHp,
	} = useGamePageViewModelContext();

	return {
		cameraStateSnapshot,
		handleCameraModeSwitch,
		handleDungeonRunReset,
		playerHp,
		playerMaxHp,
	};
};
