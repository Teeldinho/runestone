import type { Achievement } from "@/features/achievements";

type UseAchievementTrackerResult = {
	activeAchievement: Achievement | null;
};

export const useAchievementTracker = (): UseAchievementTrackerResult => {
	return { activeAchievement: null };
};
