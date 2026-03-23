import type { ACHIEVEMENT_IDS } from "../config";

export type AchievementId = (typeof ACHIEVEMENT_IDS)[keyof typeof ACHIEVEMENT_IDS];

export type Achievement = {
	id: AchievementId;
	label: string;
	description: string;
};
