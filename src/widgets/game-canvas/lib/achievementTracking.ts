import {
	ACHIEVEMENT_COPY,
	ACHIEVEMENT_IDS,
	type Achievement,
	type AchievementId,
	hasCollectedKey,
	hasDefeatedAllEnemies,
	hasEscapedFloor,
	hasReachedLibrary,
} from "@/features/achievements";

type AchievementTrackingContext = Parameters<typeof hasReachedLibrary>[0];

type AchievementTrackingTrigger = {
	id: AchievementId;
	isMet: (context: AchievementTrackingContext) => boolean;
};

type ResolveAchievementTrackingNotificationIdsInput = {
	achievementTrackingContext: AchievementTrackingContext;
	triggeredAchievementIds: ReadonlySet<AchievementId>;
};

type ShouldResetAchievementTrackerInput = {
	currentDiscoveredRoomCount: number;
	hasTreasureKey: boolean;
	previousDiscoveredRoomCount: number;
};

const ACHIEVEMENT_TRACKING_TRIGGERS = [
	{
		id: ACHIEVEMENT_IDS.FIRST_STEPS,
		isMet: hasReachedLibrary,
	},
	{
		id: ACHIEVEMENT_IDS.KEY_HUNTER,
		isMet: hasCollectedKey,
	},
	{
		id: ACHIEVEMENT_IDS.COMBAT_MASTER,
		isMet: hasDefeatedAllEnemies,
	},
	{
		id: ACHIEVEMENT_IDS.ESCAPE_ARTIST,
		isMet: hasEscapedFloor,
	},
] as const satisfies readonly AchievementTrackingTrigger[];

export const shouldResetAchievementTracker = ({
	currentDiscoveredRoomCount,
	hasTreasureKey,
	previousDiscoveredRoomCount,
}: ShouldResetAchievementTrackerInput): boolean =>
	currentDiscoveredRoomCount === 1 &&
	!hasTreasureKey &&
	previousDiscoveredRoomCount > 1;

export const resolveAchievementTrackingNotificationIds = ({
	achievementTrackingContext,
	triggeredAchievementIds,
}: ResolveAchievementTrackingNotificationIdsInput): AchievementId[] =>
	ACHIEVEMENT_TRACKING_TRIGGERS.reduce<AchievementId[]>(
		(resolvedAchievementIds, trigger) => {
			if (
				!trigger.isMet(achievementTrackingContext) ||
				triggeredAchievementIds.has(trigger.id)
			) {
				return resolvedAchievementIds;
			}

			resolvedAchievementIds.push(trigger.id);
			return resolvedAchievementIds;
		},
		[],
	);

export const createAchievementNotificationPayload = (
	achievementId: AchievementId,
): Achievement => ({
	id: achievementId,
	label: ACHIEVEMENT_COPY[achievementId].label,
	description: ACHIEVEMENT_COPY[achievementId].description,
});
