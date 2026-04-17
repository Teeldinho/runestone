import type { ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS } from "../config";

import type { Achievement } from "./types";

export type AchievementNotificationMachineContext = {
	activeAchievement: Achievement | null;
};

export type AchievementNotificationMachineEvent =
	| {
			type: (typeof ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS)["SHOW"];
			achievement: Achievement;
	  }
	| {
			type: (typeof ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS)["RESET"];
	  };
