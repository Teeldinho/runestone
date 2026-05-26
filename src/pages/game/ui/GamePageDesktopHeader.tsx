import { Link } from "@tanstack/react-router";
import { Trophy, Volume2, VolumeX } from "lucide-react";

import { GAME_PAGE_CONTROLS } from "@/pages/game/config";
import { useGamePageDesktopHeaderModel } from "@/pages/game/model";
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { LeaderboardSheet } from "@/widgets/leaderboard-panel";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

import { GamePageDesktopSettingsAction } from "./GamePageDesktopSettingsAction";

export function GamePageDesktopHeader() {
	const { currentRoomLabel, handleAudioMuteToggle, isAudioMuted } =
		useGamePageDesktopHeaderModel();

	return (
		<header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-panel-border px-4 py-2">
			<div className="flex items-center gap-3">
				<Link
					to={MARKETING_ROUTES.HOME}
					className="text-lg font-bold uppercase tracking-[0.2em] text-dungeon-gold transition-opacity hover:opacity-80"
				>
					RUNESTONE
				</Link>
				<span className="rune-text">·</span>
				<span className="rune-text">Floor I</span>
			</div>

			<div className="flex items-center gap-2 sm:gap-4">
				<span className="flex shrink-0 items-center gap-2 whitespace-nowrap">
					<span className="rune-text">Room:</span>
					<span className="rune-value text-panel-title">
						{currentRoomLabel}
					</span>
				</span>

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							type="button"
							variant="dungeon-outline"
							size="icon-sm"
							onClick={handleAudioMuteToggle}
							aria-label={
								isAudioMuted
									? GAME_PAGE_CONTROLS.AUDIO.UNMUTE_ARIA_LABEL
									: GAME_PAGE_CONTROLS.AUDIO.MUTE_ARIA_LABEL
							}
						>
							{isAudioMuted ? (
								<VolumeX className="h-4 w-4" />
							) : (
								<Volume2 className="h-4 w-4 text-[var(--dungeon-gold)]" />
							)}
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						{isAudioMuted
							? GAME_PAGE_CONTROLS.AUDIO.UNMUTE_TOOLTIP_LABEL
							: GAME_PAGE_CONTROLS.AUDIO.TOOLTIP_LABEL}
					</TooltipContent>
				</Tooltip>

				<Tooltip>
					<LeaderboardSheet>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="dungeon-outline"
								size="icon-sm"
								aria-label={GAME_PAGE_CONTROLS.LEADERBOARD.ARIA_LABEL}
							>
								<Trophy className="h-4 w-4 text-[var(--dungeon-gold)]" />
							</Button>
						</TooltipTrigger>
					</LeaderboardSheet>
					<TooltipContent>
						{GAME_PAGE_CONTROLS.LEADERBOARD.TOOLTIP_LABEL}
					</TooltipContent>
				</Tooltip>

				<GamePageDesktopSettingsAction />
			</div>
		</header>
	);
}
