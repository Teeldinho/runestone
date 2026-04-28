import { Trophy } from "lucide-react";

import { GAME_PAGE_CONTROLS } from "@/pages/game/config";
import type { GamePageMobileActionPanelModel } from "@/pages/game/model";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { LeaderboardSheet } from "@/widgets/leaderboard-panel";

type GamePageMobileLeaderboardActionProps = {
	leaderboardTrigger: GamePageMobileActionPanelModel["leaderboardTrigger"];
};

export function GamePageMobileLeaderboardAction({
	leaderboardTrigger,
}: GamePageMobileLeaderboardActionProps) {
	const { isTabletLayout } = leaderboardTrigger;

	return (
		<Tooltip>
			<LeaderboardSheet>
				<TooltipTrigger asChild>
					<Button
						variant="dungeon-outline"
						size={isTabletLayout ? "default" : "icon"}
						className={`pointer-events-auto flex items-center justify-center gap-2 ${isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
						aria-label={GAME_PAGE_CONTROLS.LEADERBOARD.ARIA_LABEL}
					>
						<Trophy className="h-4 w-4" />
						{isTabletLayout ? (
							<span className="text-xs tracking-wide uppercase">
								{GAME_PAGE_CONTROLS.LEADERBOARD.BUTTON_LABEL}
							</span>
						) : null}
					</Button>
				</TooltipTrigger>
			</LeaderboardSheet>
			<TooltipContent>
				{GAME_PAGE_CONTROLS.LEADERBOARD.TOOLTIP_LABEL}
			</TooltipContent>
		</Tooltip>
	);
}
