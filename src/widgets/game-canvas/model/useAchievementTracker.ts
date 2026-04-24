import { shallowEqual, useMachine } from "@xstate/react";
import { useEffect, useRef } from "react";

import {
	ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS,
	type Achievement,
	type AchievementId,
	achievementNotificationMachine,
} from "@/features/achievements";
import {
	selectAchievementTrackingContext,
	useGameMachineSelector,
} from "@/features/dungeon-navigation";
import { useHaptics } from "@/features/haptics-feedback";

import {
	createAchievementNotificationPayload,
	resolveAchievementTrackingNotificationIds,
	shouldResetAchievementTracker,
} from "../lib/achievementTracking";

type UseAchievementTrackerResult = {
	activeAchievement: Achievement | null;
};

type UseAchievementTrackerInput = {
	hapticsEnabled?: boolean;
};

export const useAchievementTracker = ({
	hapticsEnabled = true,
}: UseAchievementTrackerInput = {}): UseAchievementTrackerResult => {
	const achievementTrackingContext = useGameMachineSelector(
		selectAchievementTrackingContext,
		shallowEqual,
	);
	const { onAchievement } = useHaptics({ hapticsEnabled });

	const [achievementNotificationSnapshot, sendAchievementNotificationEvent] =
		useMachine(achievementNotificationMachine);
	const triggeredRef = useRef<Set<AchievementId>>(new Set());
	const prevDiscoveredCountRef = useRef<number>(
		achievementTrackingContext.discoveredRooms.length,
	);

	useEffect(() => {
		const currentDiscoveredRoomCount =
			achievementTrackingContext.discoveredRooms.length;

		if (
			shouldResetAchievementTracker({
				currentDiscoveredRoomCount,
				hasTreasureKey: achievementTrackingContext.hasTreasureKey,
				previousDiscoveredRoomCount: prevDiscoveredCountRef.current,
			})
		) {
			triggeredRef.current.clear();
			sendAchievementNotificationEvent({
				type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.RESET,
			});
		}
		prevDiscoveredCountRef.current = currentDiscoveredRoomCount;
	}, [achievementTrackingContext, sendAchievementNotificationEvent]);

	useEffect(() => {
		const pendingAchievementIds = resolveAchievementTrackingNotificationIds({
			achievementTrackingContext,
			triggeredAchievementIds: triggeredRef.current,
		});

		pendingAchievementIds.forEach((achievementId) => {
			triggeredRef.current.add(achievementId);
			onAchievement();
			sendAchievementNotificationEvent({
				type: ACHIEVEMENT_NOTIFICATION_MACHINE_EVENTS.SHOW,
				achievement: createAchievementNotificationPayload(achievementId),
			});
		});
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
