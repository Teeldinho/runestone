import { useId } from "react";
import { HealthProgress } from "@/shared/ui";
import { HUD_LABELS } from "@/widgets/hud/config";
import type { GameHudViewModel } from "@/widgets/hud/model";

type GameHudVitalsSectionProps = {
	healthBar: GameHudViewModel["healthBar"];
};

export function GameHudVitalsSection({ healthBar }: GameHudVitalsSectionProps) {
	const headingId = useId();

	return (
		<section className="space-y-2" aria-labelledby={headingId}>
			<div className="flex items-center justify-between">
				<h3 id={headingId} className="sr-only rune-text text-dungeon-gold">
					{HUD_LABELS.VITALITY}
				</h3>
				<span className="rune-text text-dungeon-gold" aria-hidden="true">
					{HUD_LABELS.VITALITY}
				</span>
				<span className="rune-value text-xs">{healthBar.label}</span>
			</div>
			<HealthProgress value={healthBar.hpPercentage} />
		</section>
	);
}

export type { GameHudVitalsSectionProps };
