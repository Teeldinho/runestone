import type { PlayerStats } from "../model/types";

export const applyDamage = (stats: PlayerStats, amount: number): PlayerStats => ({
	...stats,
	hp: stats.hp - amount,
});

export const applyHeal = (
	stats: PlayerStats,
	amount: number,
	maxHp: number,
): PlayerStats => ({
	...stats,
	hp: Math.min(maxHp, stats.hp + amount),
});

export const applyDeath = (stats: PlayerStats): PlayerStats => ({
	...stats,
	hp: 0,
});
