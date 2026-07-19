import { Badge } from "@/shared/ui";
import { HUD_COPY, HUD_DISPLAY_VARIANTS } from "@/widgets/hud/config";
import type { GameHudViewModel } from "@/widgets/hud/model";

type GameHudSnapshotSectionProps = {
	sidebarSnapshotEntries: GameHudViewModel["sidebarSnapshotEntries"];
};

export function GameHudSnapshotSection({
	sidebarSnapshotEntries,
}: GameHudSnapshotSectionProps) {
	return (
		<section className="space-y-3">
			<h3 className="rune-text border-panel-border border-b pb-1">
				{HUD_COPY.MACHINE_SNAPSHOT.TITLE}
			</h3>
			<dl aria-live="polite" className="grid gap-2">
				{sidebarSnapshotEntries.map((snapshotEntry) => (
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
									className="h-auto border-dungeon-gold bg-dungeon-gold/10 px-1.5 py-0.5 font-mono text-[10px] text-accent"
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
	);
}

export type { GameHudSnapshotSectionProps };
