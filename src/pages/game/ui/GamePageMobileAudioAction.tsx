import { Volume2, VolumeX } from "lucide-react";

import { GAME_PAGE_CONTROLS } from "@/pages/game/config";
import type { GamePageMobileActionPanelModel } from "@/pages/game/model";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

type GamePageMobileAudioActionProps = {
	audioToggle: GamePageMobileActionPanelModel["audioToggle"];
};

export function GamePageMobileAudioAction({
	audioToggle,
}: GamePageMobileAudioActionProps) {
	const { handleAudioMuteToggle, isAudioMuted, isTabletLayout } = audioToggle;

	const ariaLabel = isAudioMuted
		? GAME_PAGE_CONTROLS.AUDIO.UNMUTE_ARIA_LABEL
		: GAME_PAGE_CONTROLS.AUDIO.MUTE_ARIA_LABEL;

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant={isAudioMuted ? "dungeon-outline" : "dungeon-gold"}
					size={isTabletLayout ? "default" : "icon"}
					onClick={handleAudioMuteToggle}
					className={`pointer-events-auto ${isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
					aria-label={ariaLabel}
				>
					{isAudioMuted ? (
						<VolumeX className="h-4 w-4" />
					) : (
						<Volume2 className="h-4 w-4" />
					)}

					{isTabletLayout ? (
						<span className="text-xs tracking-wide uppercase">
							{GAME_PAGE_CONTROLS.AUDIO.BUTTON_LABEL}
						</span>
					) : null}
				</Button>
			</TooltipTrigger>
			<TooltipContent>{ariaLabel}</TooltipContent>
		</Tooltip>
	);
}
