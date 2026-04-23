import { Settings2 } from "lucide-react";

import { GAME_PAGE_CONTROLS } from "@/pages/game/config";
import type { GamePageMobileActionPanelModel } from "@/pages/game/model";
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
		<SettingsSheet>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						type="button"
						variant="dungeon-outline"
						size={isTabletLayout ? "default" : "icon"}
						className={`pointer-events-auto flex items-center justify-center gap-2 ${isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
						aria-label={GAME_PAGE_CONTROLS.SETTINGS.ARIA_LABEL}
					>
						<Settings2 className="h-4 w-4 text-[var(--dungeon-gold)]" />
						{isTabletLayout ? (
							<span className="text-xs tracking-wide uppercase">
								{GAME_PAGE_CONTROLS.SETTINGS.BUTTON_LABEL}
							</span>
						) : null}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{GAME_PAGE_CONTROLS.SETTINGS.TOOLTIP_LABEL}
				</TooltipContent>
			</Tooltip>
		</SettingsSheet>
	);
}
