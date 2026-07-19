import { Settings2 } from "lucide-react";

import { GAME_PAGE_CONTROLS } from "@/pages/game/config";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { SettingsSheet } from "@/widgets/settings-panel";

export function GamePageDesktopSettingsAction() {
	return (
		<Tooltip>
			<SettingsSheet>
				<TooltipTrigger asChild>
					<Button
						type="button"
						variant="dungeon-outline"
						size="icon-sm"
						aria-label={GAME_PAGE_CONTROLS.SETTINGS.ARIA_LABEL}
					>
						<Settings2 className="h-4 w-4 text-dungeon-gold" />
					</Button>
				</TooltipTrigger>
			</SettingsSheet>
			<TooltipContent>
				{GAME_PAGE_CONTROLS.SETTINGS.TOOLTIP_LABEL}
			</TooltipContent>
		</Tooltip>
	);
}
