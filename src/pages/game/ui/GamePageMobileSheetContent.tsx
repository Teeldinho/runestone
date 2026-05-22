import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import { useGamePageMobileSheetContentModel } from "@/pages/game/model";
import { cn } from "@/shared/lib";
import {
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	Tabs,
	TabsList,
	TabsTrigger,
} from "@/shared/ui";

import { GamePageMobileHudTab } from "./GamePageMobileHudTab";
import { GamePageMobileStatechartTab } from "./GamePageMobileStatechartTab";

export function GamePageMobileSheetContent() {
	const viewModel = useGamePageMobileSheetContentModel();

	return (
		<DrawerContent
			className={cn(
				viewModel.drawerContentHeightClassName,
				"max-w-full overflow-hidden border-panel-border/60 bg-panel/95",
			)}
			aria-label="Game bottom sheet panels"
		>
			<DrawerHeader
				className={cn(
					!viewModel.isTabletLayout &&
						"flex flex-row items-center justify-between gap-4 text-left",
				)}
			>
				<DrawerTitle>{GAME_PAGE_MOBILE_SHEET.TITLE}</DrawerTitle>
				<DrawerDescription>
					{GAME_PAGE_MOBILE_SHEET.DESCRIPTION}
				</DrawerDescription>
			</DrawerHeader>

			<div className="min-h-0 min-w-0 flex-1 overflow-hidden px-3 pb-3">
				<Tabs
					value={viewModel.mobileSheetTabId}
					onValueChange={viewModel.handleMobileSheetTabChange}
					className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden"
				>
					<TabsList className="grid h-auto w-full min-w-0 grid-cols-2 gap-2 border-0 bg-transparent p-0">
						<TabsTrigger
							value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART}
							className="h-8 min-w-0 truncate border border-panel-border/45 bg-panel/45 data-[state=active]:bg-panel"
						>
							{GAME_PAGE_MOBILE_SHEET.TAB_LABELS.STATECHART}
						</TabsTrigger>

						<TabsTrigger
							value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD}
							className="h-8 min-w-0 truncate border border-panel-border/45 bg-panel/45 data-[state=active]:bg-panel"
						>
							{GAME_PAGE_MOBILE_SHEET.TAB_LABELS.HUD}
						</TabsTrigger>
					</TabsList>

					<GamePageMobileStatechartTab />
					<GamePageMobileHudTab />
				</Tabs>
			</div>
		</DrawerContent>
	);
}
