import {
	Alert,
	AlertDescription,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui";
import { LEADERBOARD_PANEL_COPY } from "../config";
import type { LeaderboardPanelViewModel } from "../model";

type LeaderboardPanelContentProps = {
	viewModel: LeaderboardPanelViewModel;
};

export function LeaderboardPanelContent({
	viewModel,
}: LeaderboardPanelContentProps) {
	const { entries, errorMessage, hasEntries, isEmpty, isError, isLoading } =
		viewModel;

	return (
		<div className="space-y-4">
			{isLoading ? (
				<p role="status" className="text-sm text-muted-foreground">
					{LEADERBOARD_PANEL_COPY.STATE.LOADING}
				</p>
			) : null}

			{isError ? (
				<Alert variant="destructive">
					<AlertDescription>
						{errorMessage ?? LEADERBOARD_PANEL_COPY.STATE.ERROR_FALLBACK}
					</AlertDescription>
				</Alert>
			) : null}

			{isEmpty ? (
				<p className="text-sm text-muted-foreground">
					{LEADERBOARD_PANEL_COPY.STATE.EMPTY}
				</p>
			) : null}

			{hasEntries ? (
				<div className="overflow-hidden rounded-xl border border-border/70">
					<Table className="w-full text-left text-sm">
						<TableCaption className="sr-only">
							{LEADERBOARD_PANEL_COPY.TABLE.CAPTION}
						</TableCaption>
						<TableHeader className="bg-muted/30 text-muted-foreground">
							<TableRow>
								<TableHead className="px-3 py-2 font-medium">
									{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.RANK}
								</TableHead>
								<TableHead className="px-3 py-2 font-medium">
									{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.PLAYER}
								</TableHead>
								<TableHead className="px-3 py-2 font-medium">
									{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.SCORE}
								</TableHead>
								<TableHead className="px-3 py-2 font-medium">
									{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.TIME}
								</TableHead>
								<TableHead className="px-3 py-2 font-medium">
									{LEADERBOARD_PANEL_COPY.TABLE.HEADERS.ROOMS}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{entries.map((entry) => (
								<TableRow
									key={entry.rowId}
									className="border-t border-border/60"
								>
									<TableCell className="px-3 py-2 font-semibold text-panel-title">
										{entry.rankLabel}
									</TableCell>
									<TableCell className="px-3 py-2 text-foreground">
										{entry.playerLabel}
									</TableCell>
									<TableCell className="px-3 py-2 text-foreground">
										{entry.scoreLabel}
									</TableCell>
									<TableCell className="px-3 py-2 text-foreground">
										{entry.runTimeLabel}
									</TableCell>
									<TableCell className="px-3 py-2 text-foreground">
										{entry.roomsDiscoveredLabel}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			) : null}
		</div>
	);
}
