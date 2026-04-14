import { HUD_COPY, HUD_DISPLAY_VARIANTS } from "@/widgets/hud/config";
import type { HudMachineSnapshotEntry } from "@/widgets/hud/model/types";

type HudMachineSnapshotProps = {
	entries: HudMachineSnapshotEntry[];
};

export function HudMachineSnapshot({ entries }: HudMachineSnapshotProps) {
	return (
		<section className="space-y-3">
			<h3 className="rune-text border-b border-panel-border pb-1">
				{HUD_COPY.MACHINE_SNAPSHOT.TITLE}
			</h3>
			<dl aria-live="polite" className="grid gap-2">
				{entries.map((snapshotEntry) => (
					<div
						key={snapshotEntry.label}
						className="flex items-center justify-between"
					>
						<dt className="text-xs text-muted-foreground">
							{snapshotEntry.label}
						</dt>
						<dd>
							{snapshotEntry.displayVariant === HUD_DISPLAY_VARIANTS.BADGE ? (
								<span className="rounded bg-(--dungeon-gold-dim) px-1.5 py-0.5 font-mono text-[10px] text-accent border border-(--dungeon-gold)">
									{snapshotEntry.value}
								</span>
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
