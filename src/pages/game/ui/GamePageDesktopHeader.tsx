import { Link } from "@tanstack/react-router";
import { Activity, Trophy, Volume2, VolumeX } from "lucide-react";

import {
	GAME_PAGE_CONTROLS,
	GAME_PAGE_DESKTOP_HEADER_TEST_IDS,
} from "@/pages/game/config";
import { useGamePageDesktopHeaderModel } from "@/pages/game/model";
import {
	Badge,
	Button,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/ui";
import { LeaderboardSheet } from "@/widgets/leaderboard-panel";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";
import { GamePageDesktopSettingsAction } from "./GamePageDesktopSettingsAction";
import { GamePageHomeAction } from "./GamePageHomeAction";

export function GamePageDesktopHeader() {
	const { currentRoomLabel, handleAudioMuteToggle, isAudioMuted } =
		useGamePageDesktopHeaderModel();

	return (
		<header
			data-testid={GAME_PAGE_DESKTOP_HEADER_TEST_IDS.ROOT}
			className="relative z-20 flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-3 border-panel-border/70 border-b bg-panel/95 px-4 py-2 shadow-lg shadow-background/40"
		>
			<div className="flex min-w-0 items-center gap-3">
				<Link
					to={MARKETING_ROUTES.HOME}
					className="text-lg font-bold tracking-[0.2em] text-dungeon-gold uppercase transition-colors hover:text-dungeon-torch"
				>
					RUNESTONE
				</Link>
				<span aria-hidden="true" className="h-5 w-px bg-panel-border" />
				<div className="min-w-0">
					<p className="rune-text truncate text-panel-title">
						Floor I / Live Run
					</p>
					<p className="hidden text-[10px] text-muted-foreground xl:block">
						Dungeon Observatory
					</p>
				</div>
			</div>

			<div
				data-testid={GAME_PAGE_DESKTOP_HEADER_TEST_IDS.ACTIONS}
				className="flex items-center gap-2"
			>
				<Badge
					variant="outline"
					className="hidden h-8 gap-2 border-dungeon-rune/30 bg-dungeon-rune/8 px-3 text-panel-title lg:flex"
				>
					<Activity aria-hidden="true" className="size-3.5 text-dungeon-rune" />
					<span className="rune-text text-muted-foreground">Active room</span>
					<span className="rune-value text-panel-title">
						{currentRoomLabel}
					</span>
				</Badge>

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
								<Volume2 className="h-4 w-4 text-dungeon-gold" />
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
								<Trophy className="h-4 w-4 text-dungeon-gold" />
							</Button>
						</TooltipTrigger>
					</LeaderboardSheet>
					<TooltipContent>
						{GAME_PAGE_CONTROLS.LEADERBOARD.TOOLTIP_LABEL}
					</TooltipContent>
				</Tooltip>

				<GamePageDesktopSettingsAction />

				<GamePageHomeAction />
			</div>
		</header>
	);
}
