import {
	type Achievement,
	AchievementNotification,
} from "@/features/achievements";
import { Button } from "@/shared/ui";

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
				<Button
					id="game-canvas-fp-lock"
					variant="ghost"
					className="absolute inset-0 z-10 cursor-crosshair rounded-none border-0 bg-transparent text-[color-mix(in_srgb,white_60%,transparent)] text-sm font-medium hover:bg-transparent hover:text-[color-mix(in_srgb,white_60%,transparent)]"
					type="button"
				>
					{GAME_CANVAS_COPY.FIRST_PERSON_LOCK_HINT}
				</Button>
			)}
		</>
	);
}

export type { GameCanvasOverlaysProps };
