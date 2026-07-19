import { Layers } from "lucide-react";

import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import type { GamePageMobileActionPanelModel } from "@/pages/game/model";
import { cn } from "@/shared/lib";
import {
	Button,
	DrawerTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/ui";

type GamePageMobileSheetActionProps = {
	sheetTrigger: GamePageMobileActionPanelModel["sheetTrigger"];
};

export function GamePageMobileSheetAction({
	sheetTrigger,
}: GamePageMobileSheetActionProps) {
	const { isMobileSheetOpen, isTabletLayout } = sheetTrigger;

	return (
		<Tooltip>
			<DrawerTrigger asChild>
				<TooltipTrigger asChild>
					<Button
						variant={isMobileSheetOpen ? "dungeon-gold" : "dungeon-outline"}
						size={isTabletLayout ? "default" : "icon"}
						className={cn(
							"pointer-events-auto min-h-11",
							isTabletLayout ? "w-full" : "size-11 p-0",
						)}
						aria-label={`Open ${GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL}`}
					>
						<Layers className="h-4 w-4" />
						{isTabletLayout ? (
							<span className="text-xs tracking-wide uppercase">
								{GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL}
							</span>
						) : null}
					</Button>
				</TooltipTrigger>
			</DrawerTrigger>
			<TooltipContent>
				{GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL}
			</TooltipContent>
		</Tooltip>
	);
}
