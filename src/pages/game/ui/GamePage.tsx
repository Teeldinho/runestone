import { useGameMachine } from "@/features/dungeon-navigation";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";

export function GamePage() {
	const {
		actionButtons,
		currentRoomLabel,
		discoveredRoomLabels,
		resetDungeonRun,
		snapshot,
	} = useGameMachine();

	return (
		<main className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center p-8">
			<Card className="w-full border-panel-border bg-panel shadow-xl backdrop-blur">
				<CardHeader className="space-y-2 text-left">
					<CardTitle className="text-3xl font-semibold text-panel-title">
						Game Arena
					</CardTitle>
					<CardDescription className="text-base text-panel-body">
						Navigate the dungeon machine and inspect live room transitions.
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
					<section aria-labelledby="machine-snapshot-heading">
						<Card className="border-border bg-background/70">
							<CardHeader className="pb-0">
								<CardTitle
									id="machine-snapshot-heading"
									className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
								>
									Machine Snapshot
								</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4">
								<dl className="grid gap-2 text-sm text-foreground">
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Current Room</dt>
										<dd className="font-medium">{currentRoomLabel}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Room State</dt>
										<dd className="font-medium">{String(snapshot.value)}</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Treasure Key</dt>
										<dd>
											<Badge variant="outline">
												{snapshot.context.hasTreasureKey
													? "Acquired"
													: "Missing"}
											</Badge>
										</dd>
									</div>
									<div className="flex items-center justify-between">
										<dt className="text-muted-foreground">Enemies Remaining</dt>
										<dd className="font-medium">
											{snapshot.context.enemiesRemaining}
										</dd>
									</div>
								</dl>

								<section
									aria-labelledby="discovered-rooms-heading"
									className="space-y-2"
								>
									<h3
										id="discovered-rooms-heading"
										className="text-sm font-semibold text-muted-foreground"
									>
										Discovered Rooms
									</h3>
									<ul className="space-y-1 text-sm text-foreground">
										{discoveredRoomLabels.map((roomLabel) => (
											<li
												key={roomLabel}
												className="rounded-md bg-muted/40 px-2 py-1"
											>
												{roomLabel}
											</li>
										))}
									</ul>
								</section>
							</CardContent>
						</Card>
					</section>

					<section aria-labelledby="actions-heading">
						<Card className="border-border bg-background/70">
							<CardHeader className="pb-0">
								<CardTitle
									id="actions-heading"
									className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
								>
									Actions
								</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="grid gap-2 sm:grid-cols-2">
									{actionButtons.map((actionButton) => (
										<Button
											key={actionButton.eventType}
											variant="outline"
											onClick={actionButton.handleAction}
											disabled={actionButton.isDisabled}
										>
											{actionButton.label}
										</Button>
									))}
								</div>

								<Button variant="secondary" onClick={resetDungeonRun}>
									Reset Run
								</Button>
							</CardContent>
						</Card>
					</section>
				</CardContent>
			</Card>
		</main>
	);
}
