import { Trophy, Volume2, VolumeX } from "lucide-react";

import { useGamePageDesktopHeaderModel } from "@/pages/game/model";
import { Button } from "@/shared/ui";
import { LeaderboardSheet } from "@/widgets/leaderboard-panel";

export function GamePageDesktopHeader() {
	const { currentRoomLabel, handleAudioMuteToggle, isAudioMuted } =
		useGamePageDesktopHeaderModel();

	return (
		<header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-panel-border px-4 py-2">
			<div className="flex items-center gap-3">
				<span className="text-lg font-bold uppercase tracking-[0.2em] text-dungeon-gold">
					RUNESTONE
				</span>
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

				<Button
					type="button"
					variant="dungeon-outline"
					size="icon-sm"
					onClick={handleAudioMuteToggle}
					aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
				>
					{isAudioMuted ? (
						<VolumeX className="h-4 w-4" />
					) : (
						<Volume2 className="h-4 w-4 text-[var(--dungeon-gold)]" />
					)}
				</Button>

				<LeaderboardSheet>
					<Button
						type="button"
						variant="dungeon-outline"
						size="icon-sm"
						aria-label="Open Leaderboard"
					>
						<Trophy className="h-4 w-4 text-[var(--dungeon-gold)]" />
					</Button>
				</LeaderboardSheet>
			</div>
		</header>
	);
}
