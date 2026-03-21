import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/ui";

export function HomePage() {
	return (
		<main className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center p-8">
			<Card className="w-full border-panel-border bg-panel text-center shadow-xl backdrop-blur">
				<CardHeader className="space-y-4">
					<CardTitle className="text-3xl font-semibold text-panel-title">
						Runestone
					</CardTitle>
					<CardDescription className="text-base text-panel-body">
						Enter the dungeon and learn live state machines.
					</CardDescription>
				</CardHeader>
			</Card>
		</main>
	);
}
