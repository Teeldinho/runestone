import { Layers, Trophy, Volume2, VolumeX } from "lucide-react";

import { GAME_PAGE_MOBILE_SHEET } from "@/pages/game/config";
import { useGamePageMobileActionPanelModel } from "@/pages/game/model";
import {
	Badge,
	Button,
	DrawerTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/shared/ui";
import { LeaderboardSheet } from "@/widgets/leaderboard-panel";

export function GamePageMobileActionPanel() {
	const viewModel = useGamePageMobileActionPanelModel();

	return (
		<div className="pointer-events-none absolute right-4 bottom-4 z-30 flex w-[11rem] flex-col items-end gap-2 empty:hidden">
			{viewModel.hasTouchInteract ? (
				<Button
					variant="default"
					size="default"
					onClick={viewModel.handleTouchInteract}
					className="pointer-events-auto relative w-full font-bold"
				>
					{viewModel.touchInteractPrompt}
					<Badge className="absolute -top-2 -right-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-dungeon-gold p-0 shadow-[0_0_8px_var(--dungeon-gold)]" />
				</Button>
			) : null}

			{viewModel.hasTouchAttack ? (
				<Button
					variant="default"
					size="default"
					onClick={viewModel.handleTouchAttack}
					className="pointer-events-auto relative w-full font-bold"
				>
					{viewModel.touchAttackPrompt}
					<Badge className="absolute -top-2 -right-2 flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-success p-0 shadow-[0_0_8px_var(--success)]" />
				</Button>
			) : null}

			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={
							viewModel.isAudioMuted ? "dungeon-outline" : "dungeon-gold"
						}
						size={viewModel.isTabletLayout ? "default" : "icon"}
						onClick={viewModel.handleAudioMuteToggle}
						className={`pointer-events-auto ${viewModel.isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
						aria-label={viewModel.isAudioMuted ? "Unmute audio" : "Mute audio"}
					>
						{viewModel.isAudioMuted ? (
							<VolumeX className="h-4 w-4" />
						) : (
							<Volume2 className="h-4 w-4" />
						)}

						{viewModel.isTabletLayout ? (
							<span className="text-xs tracking-wide uppercase">Audio</span>
						) : null}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{viewModel.isAudioMuted ? "Unmute audio" : "Mute audio"}
				</TooltipContent>
			</Tooltip>

			<LeaderboardSheet>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="dungeon-outline"
							size={viewModel.isTabletLayout ? "default" : "icon"}
							className={`pointer-events-auto flex items-center justify-center gap-2 ${viewModel.isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
							aria-label="Open Leaderboard"
						>
							<Trophy className="h-4 w-4" />
							{viewModel.isTabletLayout ? (
								<span className="text-xs tracking-wide uppercase">
									Rankings
								</span>
							) : null}
						</Button>
					</TooltipTrigger>
					<TooltipContent>Leaderboard</TooltipContent>
				</Tooltip>
			</LeaderboardSheet>

			<DrawerTrigger asChild>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant={
								viewModel.isMobileSheetOpen ? "dungeon-gold" : "dungeon-outline"
							}
							size={viewModel.isTabletLayout ? "default" : "icon"}
							className={`pointer-events-auto ${viewModel.isTabletLayout ? "w-full" : "h-9 w-9 p-0"}`}
							aria-label={`Open ${GAME_PAGE_MOBILE_SHEET.OPEN_BUTTON_LABEL}`}
						>
							<Layers className="h-4 w-4" />
							{viewModel.isTabletLayout ? (
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
		</div>
	);
}
