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
				"max-w-full overflow-hidden rounded-t-2xl border-dungeon-rune/20 bg-panel/95 pb-[env(safe-area-inset-bottom)] shadow-2xl backdrop-blur-xl",
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
					<TabsList className="grid h-auto w-full min-w-0 grid-cols-2 gap-2 border border-panel-border/60 bg-background/35 p-1">
						<TabsTrigger
							value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.STATECHART}
							className="min-h-11 min-w-0 truncate border border-panel-border/60 bg-panel/55 data-[state=active]:border-dungeon-rune/40 data-[state=active]:bg-dungeon-rune/10 data-[state=active]:text-panel-title"
						>
							{GAME_PAGE_MOBILE_SHEET.TAB_LABELS.STATECHART}
						</TabsTrigger>

						<TabsTrigger
							value={GAME_PAGE_MOBILE_SHEET.TAB_IDS.HUD}
							className="min-h-11 min-w-0 truncate border border-panel-border/60 bg-panel/55 data-[state=active]:border-dungeon-rune/40 data-[state=active]:bg-dungeon-rune/10 data-[state=active]:text-panel-title"
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
