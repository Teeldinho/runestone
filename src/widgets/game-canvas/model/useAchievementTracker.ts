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
import { useGameMachineRuntime } from "@/features/dungeon-navigation";
import { useHaptics } from "@/features/haptics-feedback";

type UseAchievementTrackerResult = {
	activeAchievement: Achievement | null;
};

export const useAchievementTracker = (): UseAchievementTrackerResult => {
	const { snapshot } = useGameMachineRuntime();
	const { onAchievement } = useHaptics();
	const { handleSoundEffectPlay } = useAudioController();

	const [activeAchievement, setActiveAchievement] =
		useState<Achievement | null>(null);
	const triggeredRef = useRef<Set<AchievementId>>(new Set());
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const prevDiscoveredCountRef = useRef<number>(
		snapshot.context.discoveredRooms.length,
	);

	useEffect(() => {
		const count = snapshot.context.discoveredRooms.length;
		if (
			count === 1 &&
			!snapshot.context.hasTreasureKey &&
			prevDiscoveredCountRef.current > 1
		) {
			triggeredRef.current.clear();
			setActiveAchievement(null);
		}
		prevDiscoveredCountRef.current = count;
	}, [snapshot.context]);

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

		trigger(hasReachedLibrary(snapshot.context), ACHIEVEMENT_IDS.FIRST_STEPS);
		trigger(hasCollectedKey(snapshot.context), ACHIEVEMENT_IDS.KEY_HUNTER);
		trigger(
			hasDefeatedAllEnemies(snapshot.context),
			ACHIEVEMENT_IDS.COMBAT_MASTER,
		);
	}, [snapshot, onAchievement, handleSoundEffectPlay]);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	return { activeAchievement };
};
