import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/ui";
import { HUD_COPY } from "@/widgets/hud/config";
import { type HudActionButton, useGameHud } from "@/widgets/hud/model";

type GameHudProps = {
	actionButtons: HudActionButton[];
	activeStateLabel: string;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	handleDungeonRunReset: () => void;
	hasTreasureKeyLabel: string;
};

export function GameHud({
	actionButtons,
	activeStateLabel,
	currentRoomLabel,
	discoveredRoomLabels,
	enemiesRemaining,
	handleDungeonRunReset,
	hasTreasureKeyLabel,
}: GameHudProps) {
	const gameHudViewModel = useGameHud({
		actionButtons,
		activeStateLabel,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset,
		hasTreasureKeyLabel,
	});

	return (
		<div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
			<section aria-labelledby="machine-snapshot-heading">
				<Card className="border-border bg-background/70">
					<CardHeader className="pb-0">
						<CardTitle
							id="machine-snapshot-heading"
							className="text-sm font-semibold uppercase tracking-wide text-muted-foreground"
						>
							{HUD_COPY.MACHINE_SNAPSHOT.TITLE}
						</CardTitle>
					</CardHeader>

					<CardContent className="space-y-4">
						<dl className="grid gap-2 text-sm text-foreground">
							{gameHudViewModel.machineSnapshotEntries.map((snapshotEntry) => (
								<div
									key={snapshotEntry.label}
									className="flex items-center justify-between"
								>
									<dt className="text-muted-foreground">
										{snapshotEntry.label}
									</dt>
									<dd>
										{snapshotEntry.displayVariant === "badge" ? (
											<Badge variant="outline">{snapshotEntry.value}</Badge>
										) : (
											<span className="font-medium">{snapshotEntry.value}</span>
										)}
									</dd>
								</div>
							))}
						</dl>

						<section
							aria-labelledby="discovered-rooms-heading"
							className="space-y-2"
						>
							<h3
								id="discovered-rooms-heading"
								className="text-sm font-semibold text-muted-foreground"
							>
								{HUD_COPY.DISCOVERED_ROOMS.TITLE}
							</h3>
							<ul className="space-y-1 text-sm text-foreground">
								{gameHudViewModel.discoveredRoomLabels.map((roomLabel) => (
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
							{HUD_COPY.ACTIONS.TITLE}
						</CardTitle>
					</CardHeader>

					<CardContent className="space-y-4">
						<div className="grid gap-2 sm:grid-cols-2">
							{gameHudViewModel.actionButtons.map((actionButton) => (
								<Button
									key={actionButton.eventType}
									variant="outline"
									onClick={actionButton.handleDungeonActionTrigger}
									disabled={actionButton.isDisabled}
								>
									{actionButton.label}
								</Button>
							))}
						</div>

						<Button
							variant="secondary"
							onClick={gameHudViewModel.handleDungeonRunReset}
						>
							{HUD_COPY.ACTIONS.RESET_BUTTON}
						</Button>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
