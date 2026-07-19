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
				<div className="overflow-hidden rounded-xl border border-panel-border/70 bg-background/35 shadow-inner">
					<Table className="w-full text-left text-sm">
						<TableCaption className="sr-only">
							{LEADERBOARD_PANEL_COPY.TABLE.CAPTION}
						</TableCaption>
						<TableHeader className="bg-dungeon-rune/5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
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
									className="border-panel-border/50 border-t hover:bg-dungeon-rune/5"
								>
									<TableCell className="px-3 py-2 font-mono font-semibold text-dungeon-gold">
										{entry.rankLabel}
									</TableCell>
									<TableCell className="px-3 py-2 font-mono text-foreground tabular-nums">
										{entry.playerLabel}
									</TableCell>
									<TableCell className="px-3 py-2 font-mono text-foreground tabular-nums">
										{entry.scoreLabel}
									</TableCell>
									<TableCell className="px-3 py-2 font-mono text-foreground tabular-nums">
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
