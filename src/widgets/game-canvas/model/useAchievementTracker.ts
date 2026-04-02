import { shallowEqual } from "@xstate/react";
import { useEffect, useRef, useState } from "react";

import {
	ACHIEVEMENT_COPY,
	ACHIEVEMENT_DISPLAY_DURATION_MS,
	ACHIEVEMENT_IDS,
	type Achievement,
	type AchievementId,
	hasCollectedKey,
	hasDefeatedAllEnemies,
	hasReachedLibrary,
} from "@/features/achievements";
import { AUDIO_SPRITE_IDS, useAudioController } from "@/features/audio-manager";
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
	const { handleSoundEffectPlay } = useAudioController();

	const [activeAchievement, setActiveAchievement] =
		useState<Achievement | null>(null);
	const triggeredRef = useRef<Set<AchievementId>>(new Set());
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
			setActiveAchievement(null);
		}
		prevDiscoveredCountRef.current = count;
	}, [achievementTrackingContext]);

	useEffect(() => {
		const trigger = (condition: boolean, id: AchievementId) => {
			if (!condition || triggeredRef.current.has(id)) return;
			triggeredRef.current.add(id);
			onAchievement();
			handleSoundEffectPlay(AUDIO_SPRITE_IDS.ACHIEVEMENT);
			setActiveAchievement({
				id,
				label: ACHIEVEMENT_COPY[id].label,
				description: ACHIEVEMENT_COPY[id].description,
			});
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(
				() => setActiveAchievement(null),
				ACHIEVEMENT_DISPLAY_DURATION_MS,
			);
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
	}, [achievementTrackingContext, onAchievement, handleSoundEffectPlay]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	return { activeAchievement };
};
