import { HUD_COPY, HUD_DISPLAY_VARIANTS } from "@/widgets/hud/config";
import { type HudActionButton, useGameHud } from "@/widgets/hud/model";

type GameHudProps = {
	actionButtons: HudActionButton[];
	activeStateLabel: string;
	currentRoomLabel: string;
	discoveredRoomLabels: string[];
	enemiesRemaining: number;
	handleDungeonRunReset: () => void;
	hasTreasureKeyLabel: string;
	playerHp: number;
	playerMaxHp: number;
};

export function GameHud({
	actionButtons,
	activeStateLabel,
	currentRoomLabel,
	discoveredRoomLabels,
	enemiesRemaining,
	handleDungeonRunReset,
	hasTreasureKeyLabel,
	playerHp,
	playerMaxHp,
}: GameHudProps) {
	const gameHudViewModel = useGameHud({
		actionButtons,
		activeStateLabel,
		currentRoomLabel,
		discoveredRoomLabels,
		enemiesRemaining,
		handleDungeonRunReset,
		hasTreasureKeyLabel,
		playerHp,
		playerMaxHp,
	});

	const hpPercentage = Math.max(0, Math.min(100, (playerHp / playerMaxHp) * 100));
	const isLowHp = hpPercentage < 30;

	return (
		<div className="flex flex-col gap-6">
			{/* Health Bar (Custom UI) */}
			<section className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="rune-text" style={{ color: "var(--dungeon-gold)" }}>VITALITY</span>
					<span className="rune-value text-xs">{playerHp} / {playerMaxHp}</span>
				</div>
				<div className="hp-bar-track">
					<div 
						className={`hp-bar-fill ${isLowHp ? "hp-bar-fill-low" : ""}`}
						style={{ width: `${hpPercentage}%` }}
					/>
				</div>
			</section>

			{/* Machine Snapshot */}
			<section className="space-y-3">
				<h3 className="rune-text border-b pb-1" style={{ borderColor: "var(--panel-border)" }}>
					{HUD_COPY.MACHINE_SNAPSHOT.TITLE}
				</h3>
				<dl aria-live="polite" className="grid gap-2">
					{gameHudViewModel.machineSnapshotEntries
						.filter(entry => entry.label !== "Player HP") // HP handles above
						.map((snapshotEntry) => (
						<div key={snapshotEntry.label} className="flex items-center justify-between">
							<dt className="text-xs text-[var(--muted-foreground)]">
								{snapshotEntry.label}
							</dt>
							<dd>
								{snapshotEntry.displayVariant === HUD_DISPLAY_VARIANTS.BADGE ? (
									<span className="rounded bg-[var(--dungeon-gold-dim)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--accent)] border border-[var(--dungeon-gold)]">
										{snapshotEntry.value}
									</span>
								) : (
									<span className="rune-value text-xs">{snapshotEntry.value}</span>
								)}
							</dd>
						</div>
					))}
				</dl>
			</section>

			{/* Discovered Rooms */}
			<section className="space-y-2">
				<h3 className="rune-text border-b pb-1" style={{ borderColor: "var(--panel-border)" }}>
					{HUD_COPY.DISCOVERED_ROOMS.TITLE}
				</h3>
				<ul className="flex flex-wrap gap-1">
					{gameHudViewModel.discoveredRoomLabels.map((roomLabel) => (
						<li
							key={roomLabel}
							className="rounded border border-[var(--panel-border)] bg-black/40 px-2 py-1 text-xs text-[var(--muted-foreground)] shadow-inner"
						>
							{roomLabel}
						</li>
					))}
				</ul>
			</section>

			{/* Actions */}
			<section className="mt-4 space-y-3">
				<h3 className="rune-text border-b pb-1" style={{ borderColor: "var(--panel-border)" }}>
					{HUD_COPY.ACTIONS.TITLE}
				</h3>
				
				<div className="flex flex-col gap-2">
					{gameHudViewModel.actionButtons.map((actionButton) => (
						<button
							key={actionButton.eventType}
							type="button"
							onClick={actionButton.handleDungeonActionTrigger}
							disabled={actionButton.isDisabled}
							className="dungeon-btn"
						>
							{actionButton.label}
						</button>
					))}
				</div>

				<div className="pt-4">
					<button
						type="button"
						onClick={gameHudViewModel.handleDungeonRunReset}
						className="dungeon-btn dungeon-btn-danger uppercase tracking-widest text-[10px]"
					>
						{HUD_COPY.ACTIONS.RESET_BUTTON}
					</button>
				</div>
			</section>
		</div>
	);
}
