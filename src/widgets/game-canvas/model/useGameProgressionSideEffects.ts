import type { RoomId } from "@/entities/dungeon";
import type { ScoreSubmissionPayload } from "./useFloorCompletionScoreSubmission";
import { useFloorCompletionScoreSubmission } from "./useFloorCompletionScoreSubmission";
import { usePlayerDeathHaptic } from "./usePlayerDeathHaptic";

type UseGameProgressionSideEffectsInput = {
	activeStateLabel: string;
	authenticatedProfile: { id: string } | null;
	deadState: string;
	discoveredRooms: RoomId[];
	healthState: string;
	onFloorComplete: () => void;
	onPlayerDeath: () => void;
	submitScore: {
		mutate: (payload: ScoreSubmissionPayload) => void;
	};
};

export const useGameProgressionSideEffects = ({
	activeStateLabel,
	authenticatedProfile,
	deadState,
	discoveredRooms,
	healthState,
	onFloorComplete,
	onPlayerDeath,
	submitScore,
}: UseGameProgressionSideEffectsInput): void => {
	useFloorCompletionScoreSubmission({
		activeStateLabel,
		authenticatedProfile,
		discoveredRooms,
		onFloorComplete,
		submitScore,
	});

	usePlayerDeathHaptic({
		deadState,
		healthState,
		onPlayerDeath,
	});
};

export type { UseGameProgressionSideEffectsInput };
