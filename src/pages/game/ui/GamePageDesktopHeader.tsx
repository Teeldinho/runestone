import { Trophy, Volume2, VolumeX } from "lucide-react";

import { useGamePageDesktopHeaderModel } from "@/pages/game/model";
import { LeaderboardSheet } from "@/widgets/leaderboard-panel";

export function GamePageDesktopHeader() {
	const { currentRoomLabel, handleAudioMuteToggle, isAudioMuted } =
		useGamePageDesktopHeaderModel();

	return (
		<header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-panel-border px-4 py-2">
			<div className="flex items-center gap-3">
				<span className="rune-text text-lg font-bold tracking-[0.2em] text-dungeon-gold">
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

				<button
					type="button"
					onClick={handleAudioMuteToggle}
					className="dungeon-btn w-auto px-2 py-1"
					aria-label={isAudioMuted ? "Unmute audio" : "Mute audio"}
				>
					{isAudioMuted ? (
						<VolumeX className="h-4 w-4" />
					) : (
						<Volume2 className="h-4 w-4 text-[var(--dungeon-gold)]" />
					)}
				</button>

				<LeaderboardSheet>
					<button
						type="button"
						className="dungeon-btn w-auto px-2 py-1"
						aria-label="Open Leaderboard"
					>
						<Trophy className="h-4 w-4 text-[var(--dungeon-gold)]" />
					</button>
				</LeaderboardSheet>
			</div>
		</header>
	);
}
