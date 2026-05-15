import {
	type Achievement,
	AchievementNotification,
} from "@/features/achievements";
import { DamageFlashOverlay } from "./DamageFlashOverlay";
import { GameOverOverlay } from "./GameOverOverlay";

type GameCanvasOverlaysProps = {
	activeAchievement: Achievement | null;
	handleGameRestart: () => void;
	isGameOver: boolean;
};

export function GameCanvasOverlays({
	activeAchievement,
	handleGameRestart,
	isGameOver,
}: GameCanvasOverlaysProps) {
	return (
		<>
			<AchievementNotification achievement={activeAchievement} />
			<DamageFlashOverlay />
			<GameOverOverlay isGameOver={isGameOver} onRestart={handleGameRestart} />
		</>
	);
}

export type { GameCanvasOverlaysProps };
