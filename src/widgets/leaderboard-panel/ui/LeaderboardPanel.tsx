import { useLeaderboardSnapshot } from "@/features/leaderboard";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";

import { LEADERBOARD_PANEL_COPY } from "../config";

export function LeaderboardPanel() {
	const leaderboardSnapshot = useLeaderboardSnapshot();

	return (
		<Card className="w-full border-panel-border bg-panel shadow-xl backdrop-blur">
			<CardHeader className="space-y-2">
				<CardTitle
					id="leaderboard-panel-heading"
					className="text-3xl font-semibold text-panel-title"
				>
					{LEADERBOARD_PANEL_COPY.TITLE}
				</CardTitle>
				<CardDescription className="text-base text-panel-body">
					{LEADERBOARD_PANEL_COPY.DESCRIPTION}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{leaderboardSnapshot.state === "loading" ? (
					<p role="status" className="text-sm text-muted-foreground">
						{LEADERBOARD_PANEL_COPY.STATE.LOADING}
					</p>
				) : null}

				{leaderboardSnapshot.state === "error" ? (
					<p role="alert" className="text-sm text-destructive">
						{leaderboardSnapshot.errorMessage ??
							LEADERBOARD_PANEL_COPY.STATE.ERROR_FALLBACK}
					</p>
				) : null}

				{leaderboardSnapshot.state === "ready" &&
				leaderboardSnapshot.entries.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						{LEADERBOARD_PANEL_COPY.STATE.EMPTY}
					</p>
				) : null}

				{leaderboardSnapshot.state === "ready" &&
				leaderboardSnapshot.entries.length > 0 ? (
					<div className="overflow-hidden rounded-md border border-border/70">
						<table className="w-full text-left text-sm">
							<caption className="sr-only">
								{LEADERBOARD_PANEL_COPY.TABLE.CAPTION}
							</caption>
							<thead className="bg-muted/30 text-muted-foreground">
								<tr>
									<th className="px-3 py-2 font-medium">
										{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.RANK}
									</th>
									<th className="px-3 py-2 font-medium">
										{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.PLAYER}
									</th>
									<th className="px-3 py-2 font-medium">
										{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.SCORE}
									</th>
									<th className="px-3 py-2 font-medium">
										{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.TIME}
									</th>
									<th className="px-3 py-2 font-medium">
										{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.ROOMS}
									</th>
								</tr>
							</thead>
							<tbody>
								{leaderboardSnapshot.entries.map((entry) => (
									<tr key={entry.rowId} className="border-t border-border/60">
										<td className="px-3 py-2 font-semibold text-panel-title">
											{entry.rankLabel}
										</td>
										<td className="px-3 py-2 text-foreground">
											{entry.playerLabel}
										</td>
										<td className="px-3 py-2 text-foreground">
											{entry.scoreLabel}
										</td>
										<td className="px-3 py-2 text-foreground">
											{entry.runTimeLabel}
										</td>
										<td className="px-3 py-2 text-foreground">
											{entry.roomsDiscoveredLabel}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}
