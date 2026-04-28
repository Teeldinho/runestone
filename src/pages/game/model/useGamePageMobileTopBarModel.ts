import {
	useGamePageCanvasContext,
	useGamePageHudContext,
} from "./useGamePageSliceContexts";

export const useGamePageMobileTopBarModel = () => {
	const canvas = useGamePageCanvasContext();
	const hud = useGamePageHudContext();

	return {
		cameraStateSnapshot: canvas.cameraStateSnapshot,
		handleCameraModeSwitch: canvas.handleCameraModeSwitch,
		handleDungeonRunReset: hud.handleDungeonRunReset,
		playerHp: hud.playerHp,
		playerMaxHp: hud.playerMaxHp,
	};
};
