import { LeaderboardPanel } from "@/widgets/leaderboard-panel";

export function LeaderboardPage() {
	return (
		<main className="mx-auto flex min-h-dvh w-full max-w-5xl items-center justify-center p-8">
			<section aria-labelledby="leaderboard-panel-heading" className="w-full">
				<LeaderboardPanel />
			</section>
		</main>
	);
}
