import { Settings2 } from "lucide-react";

import { GAME_PAGE_CONTROLS } from "@/pages/game/config";
import type { GamePageMobileActionPanelModel } from "@/pages/game/model";
import { cn } from "@/shared/lib";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { SettingsSheet } from "@/widgets/settings-panel";

type GamePageMobileSettingsActionProps = {
	settingsTrigger: GamePageMobileActionPanelModel["settingsTrigger"];
};

export function GamePageMobileSettingsAction({
	settingsTrigger,
}: GamePageMobileSettingsActionProps) {
	const { isTabletLayout } = settingsTrigger;

	return (
		<Tooltip>
			<SettingsSheet>
				<TooltipTrigger asChild>
					<Button
						type="button"
						variant="dungeon-outline"
						size={isTabletLayout ? "default" : "icon"}
						className={cn(
							"pointer-events-auto flex min-h-11 items-center justify-center gap-2",
							isTabletLayout ? "w-full" : "size-11 p-0",
						)}
						aria-label={GAME_PAGE_CONTROLS.SETTINGS.ARIA_LABEL}
					>
						<Settings2 className="h-4 w-4" />
						{isTabletLayout ? (
							<span className="text-xs tracking-wide uppercase">
								{GAME_PAGE_CONTROLS.SETTINGS.BUTTON_LABEL}
							</span>
						) : null}
					</Button>
				</TooltipTrigger>
			</SettingsSheet>
			<TooltipContent>
				{GAME_PAGE_CONTROLS.SETTINGS.TOOLTIP_LABEL}
			</TooltipContent>
		</Tooltip>
	);
}
