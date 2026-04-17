import { ACHIEVEMENT_NOTIFICATION_CONTEXT_KEYS } from "../config";

import type { AchievementNotificationMachineContext } from "../model/achievementNotificationMachineTypes";
import type { Achievement } from "../model/types";

export const createIdleAchievementNotificationContext =
	(): AchievementNotificationMachineContext => ({
		[ACHIEVEMENT_NOTIFICATION_CONTEXT_KEYS.ACTIVE_ACHIEVEMENT]: null,
	});

export const createShowingAchievementNotificationContext = (
	achievement: Achievement,
): AchievementNotificationMachineContext => ({
	[ACHIEVEMENT_NOTIFICATION_CONTEXT_KEYS.ACTIVE_ACHIEVEMENT]: achievement,
});
