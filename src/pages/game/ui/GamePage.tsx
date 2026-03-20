import { useGameMachine } from "@/features/dungeon-navigation";
import { Button } from "@/shared/ui";

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
			<section className="w-full rounded-2xl border border-panel-border bg-panel p-8 shadow-xl backdrop-blur">
				<header className="space-y-2 text-left">
					<h1 className="text-3xl font-semibold text-panel-title">
						Game Arena
					</h1>
					<p className="text-base text-panel-body">
						Navigate the dungeon machine and inspect live room transitions.
					</p>
				</header>

				<div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
					<article className="space-y-4 rounded-xl border border-border bg-background/70 p-4">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Machine Snapshot
						</h2>

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
								<dd className="font-medium">
									{snapshot.context.hasTreasureKey ? "Acquired" : "Missing"}
								</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Enemies Remaining</dt>
								<dd className="font-medium">
									{snapshot.context.enemiesRemaining}
								</dd>
							</div>
						</dl>

						<div className="space-y-2">
							<h3 className="text-sm font-semibold text-muted-foreground">
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
						</div>
					</article>

					<article className="space-y-4 rounded-xl border border-border bg-background/70 p-4">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
							Actions
						</h2>

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
					</article>
				</div>
			</section>
		</main>
	);
}
