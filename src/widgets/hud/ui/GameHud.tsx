import { Badge, Button } from "@/shared/ui";
import {
	HUD_COPY,
	HUD_DISPLAY_VARIANTS,
	HUD_LABELS,
} from "@/widgets/hud/config";
import type {
	GameHudActions,
	GameHudPlayerStats,
	GameHudSnapshot,
} from "@/widgets/hud/model";
import { useGameHud } from "@/widgets/hud/model";

type GameHudProps = {
	actions: GameHudActions;
	playerStats: GameHudPlayerStats;
	snapshot: GameHudSnapshot;
};

export function GameHud({ actions, playerStats, snapshot }: GameHudProps) {
	const gameHudViewModel = useGameHud({
		actions,
		playerStats,
		snapshot,
	});

	return (
		<div className="flex flex-col gap-6">
			<section className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="rune-text text-dungeon-gold">
						{HUD_LABELS.VITALITY}
					</span>
					<span className="rune-value text-xs">
						{gameHudViewModel.healthBar.label}
					</span>
				</div>
				<div className="hp-bar-track">
					<div
						className={gameHudViewModel.healthBar.fillClassName}
						style={{ width: `${gameHudViewModel.healthBar.hpPercentage}%` }}
					/>
				</div>
			</section>

			<section className="space-y-3">
				<h3 className="rune-text border-panel-border border-b pb-1">
					{HUD_COPY.MACHINE_SNAPSHOT.TITLE}
				</h3>
				<dl aria-live="polite" className="grid gap-2">
					{gameHudViewModel.sidebarSnapshotEntries.map((snapshotEntry) => (
						<div
							key={snapshotEntry.label}
							className="flex items-center justify-between"
						>
							<dt className="text-xs text-muted-foreground">
								{snapshotEntry.label}
							</dt>
							<dd>
								{snapshotEntry.displayVariant === HUD_DISPLAY_VARIANTS.BADGE ? (
									<Badge
										variant="outline"
										className="h-auto border-dungeon-gold bg-dungeon-gold-dim px-1.5 py-0.5 font-mono text-[10px] text-accent"
									>
										{snapshotEntry.value}
									</Badge>
								) : (
									<span className="rune-value text-xs">
										{snapshotEntry.value}
									</span>
								)}
							</dd>
						</div>
					))}
				</dl>
			</section>

			<section className="space-y-2">
				<h3 className="rune-text border-panel-border border-b pb-1">
					{HUD_COPY.DISCOVERED_ROOMS.TITLE}
				</h3>
				<ul className="flex flex-wrap gap-1">
					{gameHudViewModel.discoveredRoomLabels.map((roomLabel) => (
						<li key={roomLabel}>
							<Badge
								variant="outline"
								className="h-auto rounded border-panel-border bg-black/40 px-2 py-1 text-xs text-muted-foreground shadow-inner"
							>
								{roomLabel}
							</Badge>
						</li>
					))}
				</ul>
			</section>

			<section className="mt-4 space-y-3">
				<h3 className="rune-text border-panel-border border-b pb-1">
					{HUD_COPY.ACTIONS.TITLE}
				</h3>

				<div className="flex flex-col gap-2">
					{gameHudViewModel.actionButtons.map((actionButton) => (
						<Button
							key={actionButton.eventType}
							type="button"
							onClick={actionButton.handleDungeonActionTrigger}
							disabled={actionButton.isDisabled}
							variant="dungeon-outline"
							className="w-full justify-start"
						>
							{actionButton.label}
						</Button>
					))}
				</div>

				<div className="pt-4">
					<Button
						type="button"
						onClick={gameHudViewModel.handleDungeonRunReset}
						variant="destructive"
						className="w-full uppercase tracking-widest text-[10px]"
					>
						{HUD_COPY.ACTIONS.RESET_BUTTON}
					</Button>
				</div>
			</section>
		</div>
	);
}
