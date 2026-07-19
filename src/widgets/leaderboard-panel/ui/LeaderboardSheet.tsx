import type { ReactNode } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/shared/ui";
import { LEADERBOARD_PANEL_COPY } from "../config";
import { useLeaderboardPanel } from "../model";

import { LeaderboardPanelContent } from "./LeaderboardPanelContent";

type LeaderboardSheetProps = {
	children: ReactNode;
};

export function LeaderboardSheet({ children }: LeaderboardSheetProps) {
	const leaderboardPanel = useLeaderboardPanel();

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent
				side="right"
				className="flex w-full flex-col border-panel-border/70 bg-panel/95 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-2xl backdrop-blur-xl sm:w-[45rem] sm:max-w-2xl data-[side=right]:sm:max-w-2xl"
			>
				<SheetHeader className="space-y-2 border-panel-border/60 border-b bg-background/20 pr-16 pb-4">
					<SheetTitle className="text-xl font-semibold tracking-tight text-panel-title">
						{LEADERBOARD_PANEL_COPY.TITLE}
					</SheetTitle>
					<SheetDescription className="text-base text-panel-body">
						{LEADERBOARD_PANEL_COPY.DESCRIPTION}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 min-h-0 overflow-y-auto px-4 pb-4">
					<LeaderboardPanelContent viewModel={leaderboardPanel} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
