import {
	LEADERBOARD_PANEL_IDS,
	LeaderboardPanel,
} from "@/widgets/leaderboard-panel";

export function LeaderboardPage() {
	return (
		<main
			id="main-content"
			className="mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center p-8"
		>
			<section aria-labelledby={LEADERBOARD_PANEL_IDS.ROOT} className="w-full">
				<LeaderboardPanel />
			</section>
		</main>
	);
}
