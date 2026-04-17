import { useGamePageViewModelContext } from "./useGamePageViewModelContext";

export const useGamePageMobileTopBarModel = () => {
	const { canvas, hud } = useGamePageViewModelContext();

	return {
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		handleCameraModeSwitch: canvas.handleCameraModeSwitch,
		handleDungeonRunReset: hud.handleDungeonRunReset,
		playerHp: hud.playerHp,
		playerMaxHp: hud.playerMaxHp,
	};
};
