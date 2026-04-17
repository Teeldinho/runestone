import {
	type Achievement,
	AchievementNotification,
} from "@/features/achievements";

import { GAME_CANVAS_COPY } from "../config";
import { DamageFlashOverlay } from "./DamageFlashOverlay";
import { GameOverOverlay } from "./GameOverOverlay";

type GameCanvasOverlaysProps = {
	activeAchievement: Achievement | null;
	handleGameRestart: () => void;
	isGameOver: boolean;
	showFirstPersonLockHint: boolean;
};

export function GameCanvasOverlays({
	activeAchievement,
	handleGameRestart,
	isGameOver,
	showFirstPersonLockHint,
}: GameCanvasOverlaysProps) {
	return (
		<>
			<AchievementNotification achievement={activeAchievement} />
			<DamageFlashOverlay />
			<GameOverOverlay isGameOver={isGameOver} onRestart={handleGameRestart} />
			{showFirstPersonLockHint && (
				<button
					id="game-canvas-fp-lock"
					className="absolute inset-0 z-10 flex cursor-crosshair items-center justify-center bg-transparent text-[color-mix(in_srgb,white_60%,transparent)] text-sm font-medium"
					type="button"
				>
					{GAME_CANVAS_COPY.FIRST_PERSON_LOCK_HINT}
				</button>
			)}
		</>
	);
}

export type { GameCanvasOverlaysProps };
