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
					<LeaderboardPanelContent viewModel={leaderboardPanel} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
