import { HUD_COPY } from "@/widgets/hud/config";

type HudHealthBarProps = {
	hpPercentage: number;
	isLowHp: boolean;
	playerHp: number;
	playerMaxHp: number;
};

export function HudHealthBar({
	hpPercentage,
	isLowHp,
	playerHp,
	playerMaxHp,
}: HudHealthBarProps) {
	return (
		<section className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="rune-text" style={{ color: "var(--dungeon-gold)" }}>
					{HUD_COPY.VITALITY}
				</span>
				<span className="rune-value text-xs">
					{playerHp} / {playerMaxHp}
				</span>
			</div>
			<div className="hp-bar-track">
				<div
					className={`hp-bar-fill ${isLowHp ? "hp-bar-fill-low" : ""}`}
					style={{ width: `${hpPercentage}%` }}
				/>
			</div>
		</section>
	);
}
