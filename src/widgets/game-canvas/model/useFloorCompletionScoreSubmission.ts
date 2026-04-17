import { useEffect, useRef } from "react";

import type { RoomId } from "@/entities/dungeon";
import { FLOOR_IDS } from "@/entities/dungeon";
import { SCORE_VALUES } from "@/shared/config";

import { shouldSubmitFloorScore } from "../lib";

type ScoreSubmissionPayload = {
	userId: string;
	dungeonId: string;
	score: number;
	timeMs: number;
	roomsDiscovered: number;
};

type UseFloorCompletionScoreSubmissionInput = {
	activeStateLabel: string;
	discoveredRooms: RoomId[];
	authenticatedProfile: { id: string } | null;
	onFloorComplete: () => void;
	submitScore: {
		mutate: (payload: ScoreSubmissionPayload) => void;
	};
};

export const useFloorCompletionScoreSubmission = ({
	activeStateLabel,
	discoveredRooms,
	authenticatedProfile,
	onFloorComplete,
	submitScore,
}: UseFloorCompletionScoreSubmissionInput): void => {
	const startTimeMsRef = useRef(Date.now());
	const hasSubmittedRef = useRef(false);

	useEffect(() => {
		if (!shouldSubmitFloorScore(activeStateLabel, hasSubmittedRef.current)) {
			return;
		}

		if (!authenticatedProfile) {
			return;
		}

		hasSubmittedRef.current = true;
		onFloorComplete();
		submitScore.mutate({
			userId: authenticatedProfile.id,
			dungeonId: FLOOR_IDS.FLOOR_ONE,
			score: discoveredRooms.length * SCORE_VALUES.ROOM_DISCOVERY,
			timeMs: Date.now() - startTimeMsRef.current,
			roomsDiscovered: discoveredRooms.length,
		});
	}, [
		activeStateLabel,
		authenticatedProfile,
		discoveredRooms,
		onFloorComplete,
		submitScore,
	]);
};

export type { ScoreSubmissionPayload, UseFloorCompletionScoreSubmissionInput };
