import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";
import { LEADERBOARD_PANEL_COPY, LEADERBOARD_PANEL_IDS } from "../config";
import { useLeaderboardPanel } from "../model";

import { LeaderboardPanelContent } from "./LeaderboardPanelContent";

export function LeaderboardPanel() {
	const leaderboardPanel = useLeaderboardPanel();

	return (
		<Card className="w-full border-panel-border bg-panel shadow-xl backdrop-blur">
			<CardHeader className="space-y-2">
				<CardTitle
					id={LEADERBOARD_PANEL_IDS.ROOT}
					className="text-3xl font-semibold text-panel-title"
				>
					{LEADERBOARD_PANEL_COPY.TITLE}
				</CardTitle>
				<CardDescription className="text-base text-panel-body">
					{LEADERBOARD_PANEL_COPY.DESCRIPTION}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<LeaderboardPanelContent viewModel={leaderboardPanel} />
			</CardContent>
		</Card>
	);
}
