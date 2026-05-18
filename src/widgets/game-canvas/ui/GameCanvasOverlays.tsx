import {
	type Achievement,
	AchievementNotification,
} from "@/features/achievements";
import type { CameraMode } from "@/features/camera-system";

import { DamageFlashOverlay } from "./DamageFlashOverlay";
import { FirstPersonLockHint } from "./FirstPersonLockHint";
import { GameOverOverlay } from "./GameOverOverlay";

type GameCanvasOverlaysProps = {
	activeAchievement: Achievement | null;
	cameraMode: CameraMode;
	handleGameRestart: () => void;
	isGameOver: boolean;
};

export function GameCanvasOverlays({
	activeAchievement,
	cameraMode,
	handleGameRestart,
	isGameOver,
}: GameCanvasOverlaysProps) {
	return (
		<>
			<AchievementNotification achievement={activeAchievement} />
			<DamageFlashOverlay />
			<FirstPersonLockHint cameraMode={cameraMode} />
			<GameOverOverlay isGameOver={isGameOver} onRestart={handleGameRestart} />
		</>
	);
}

export type { GameCanvasOverlaysProps };
