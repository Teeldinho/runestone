import type { ReactNode } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/ui";
import { LEADERBOARD_PANEL_COPY } from "@/widgets/leaderboard-panel/config";
import { useLeaderboardPanel } from "@/widgets/leaderboard-panel/model";

type LeaderboardSheetProps = {
	children: ReactNode;
};

export function LeaderboardSheet({ children }: LeaderboardSheetProps) {
	const { entries, errorMessage, hasEntries, isEmpty, isError, isLoading } =
		useLeaderboardPanel();

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent
				side="right"
				className="w-full flex flex-col border-panel-border bg-panel shadow-xl backdrop-blur sm:w-[45rem] sm:max-w-2xl data-[side=right]:sm:max-w-2xl"
			>
				<SheetHeader className="space-y-2 pb-4">
					<SheetTitle className="text-3xl font-semibold text-panel-title">
						{LEADERBOARD_PANEL_COPY.TITLE}
					</SheetTitle>
					<SheetDescription className="text-base text-panel-body">
						{LEADERBOARD_PANEL_COPY.DESCRIPTION}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
					<div className="space-y-4">
						{isLoading ? (
							<p role="status" className="text-sm text-muted-foreground">
								{LEADERBOARD_PANEL_COPY.STATE.LOADING}
							</p>
						) : null}

						{isError ? (
							<p role="alert" className="text-sm text-destructive">
								{errorMessage ?? LEADERBOARD_PANEL_COPY.STATE.ERROR_FALLBACK}
							</p>
						) : null}

						{isEmpty ? (
							<p className="text-sm text-muted-foreground">
								{LEADERBOARD_PANEL_COPY.STATE.EMPTY}
							</p>
						) : null}

						{hasEntries ? (
							<Table className="border border-border/70 rounded-md overflow-hidden">
								<TableCaption className="sr-only">
									{LEADERBOARD_PANEL_COPY.TABLE.CAPTION}
								</TableCaption>
								<TableHeader className="bg-muted/30">
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
						) : null}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
