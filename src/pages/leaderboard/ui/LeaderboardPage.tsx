import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui";

export function LeaderboardPage() {
	return (
		<main className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center p-8">
			<Card className="w-full border-panel-border bg-panel text-center shadow-xl backdrop-blur">
				<CardHeader className="space-y-4">
					<CardTitle className="text-3xl font-semibold text-panel-title">
						Leaderboard
					</CardTitle>
					<CardDescription className="text-base text-panel-body">
						Live Convex scoreboard arrives in later steps.
					</CardDescription>
				</CardHeader>
			</Card>
		</main>
	);
}
