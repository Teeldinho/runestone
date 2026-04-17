import { HUD_LABELS } from "@/widgets/hud/config";
import type { GameHudViewModel } from "@/widgets/hud/model";

type GameHudVitalsSectionProps = {
	healthBar: GameHudViewModel["healthBar"];
};

export function GameHudVitalsSection({ healthBar }: GameHudVitalsSectionProps) {
	return (
		<section className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="rune-text text-dungeon-gold">
					{HUD_LABELS.VITALITY}
				</span>
				<span className="rune-value text-xs">{healthBar.label}</span>
			</div>
			<div className="hp-bar-track">
				<div
					className={healthBar.fillClassName}
					style={{ width: `${healthBar.hpPercentage}%` }}
				/>
			</div>
		</section>
	);
}

export type { GameHudVitalsSectionProps };
