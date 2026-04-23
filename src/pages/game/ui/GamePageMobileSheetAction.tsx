import { Layers } from "lucide-react";

import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import type { GamePageMobileActionPanelModel } from "@/pages/game/model";
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
		<DrawerTrigger asChild>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={isMobileSheetOpen ? "dungeon-gold" : "dungeon-outline"}
						size={isTabletLayout ? "default" : "icon"}
						className={`pointer-events-auto ${isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
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
				<TooltipContent>
					{GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL}
				</TooltipContent>
			</Tooltip>
		</DrawerTrigger>
	);
}
