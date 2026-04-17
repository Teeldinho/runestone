import { shallowEqual, useMachine } from "@xstate/react";
import { useEffect, useRef } from "react";

import {
	ACHIEVEMENT_COPY,
	ACHIEVEMENT_IDS,
	ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS,
	type Achievement,
	type AchievementId,
	achievementNotificationMachine,
	hasCollectedKey,
	hasDefeatedAllEnemies,
	hasEscapedFloor,
	hasReachedLibrary,
} from "@/features/achievements";
import {
	selectAchievementTrackingContext,
	useGameMachineSelector,
} from "@/features/dungeon-navigation";
import { useHaptics } from "@/features/haptics-feedback";

type UseAchievementTrackerResult = {
	activeAchievement: Achievement | null;
};

export const useAchievementTracker = (): UseAchievementTrackerResult => {
	const achievementTrackingContext = useGameMachineSelector(
		selectAchievementTrackingContext,
		shallowEqual,
	);
	const { onAchievement } = useHaptics();

	const [achievementNotificationSnapshot, sendAchievementNotificationEvent] =
		useMachine(achievementNotificationMachine);
	const triggeredRef = useRef<Set<AchievementId>>(new Set());
	const prevDiscoveredCountRef = useRef<number>(
		achievementTrackingContext.discoveredRooms.length,
	);

	useEffect(() => {
		const count = achievementTrackingContext.discoveredRooms.length;
		if (
			count === 1 &&
			!achievementTrackingContext.hasTreasureKey &&
			prevDiscoveredCountRef.current > 1
		) {
			triggeredRef.current.clear();
			sendAchievementNotificationEvent({
				type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.RESET,
			});
		}
		prevDiscoveredCountRef.current = count;
	}, [achievementTrackingContext, sendAchievementNotificationEvent]);

	useEffect(() => {
		const trigger = (condition: boolean, id: AchievementId) => {
			if (!condition || triggeredRef.current.has(id)) return;
			triggeredRef.current.add(id);
			onAchievement();
			sendAchievementNotificationEvent({
				type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.SHOW,
				achievement: {
					id,
					label: ACHIEVEMENT_COPY[id].label,
					description: ACHIEVEMENT_COPY[id].description,
				},
			});
		};

		trigger(
			hasReachedLibrary(achievementTrackingContext),
			ACHIEVEMENT_IDS.FIRST_STEPS,
		);
		trigger(
			hasCollectedKey(achievementTrackingContext),
			ACHIEVEMENT_IDS.KEY_HUNTER,
		);
		trigger(
			hasDefeatedAllEnemies(achievementTrackingContext),
			ACHIEVEMENT_IDS.COMBAT_MASTER,
		);
		trigger(
			hasEscapedFloor(achievementTrackingContext),
			ACHIEVEMENT_IDS.ESCAPE_ARTIST,
		);
	}, [
		achievementTrackingContext,
		onAchievement,
		sendAchievementNotificationEvent,
	]);

	return {
		activeAchievement: achievementNotificationSnapshot.context
			.activeAchievement as Achievement | null,
	};
};
