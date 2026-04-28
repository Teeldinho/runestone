// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ROOM_IDS } from "@/entities/dungeon";
import { PLAYER_STATES } from "@/entities/player";

const mockUseFloorCompletionScoreSubmission = vi.fn();
const mockUsePlayerDeathHaptic = vi.fn();

vi.mock("./useFloorCompletionScoreSubmission", () => ({
	useFloorCompletionScoreSubmission: (...args: unknown[]) =>
		mockUseFloorCompletionScoreSubmission(...args),
}));

vi.mock("./usePlayerDeathHaptic", () => ({
	usePlayerDeathHaptic: (...args: unknown[]) =>
		mockUsePlayerDeathHaptic(...args),
}));

import { useGameProgressionSideEffects } from "./useGameProgressionSideEffects";

describe("useGameProgressionSideEffects", () => {
	it("delegates score submission and death haptic data to the underlying hooks", () => {
		const onFloorComplete = vi.fn();
		const onPlayerDeath = vi.fn();
		const submitScore = { mutate: vi.fn() };

		renderHook(() =>
			useGameProgressionSideEffects({
				activeStateLabel: "done",
				authenticatedProfile: { id: "user-convex-id" },
				deadState: PLAYER_STATES.HEALTH.DEAD,
				discoveredRooms: [ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY],
				healthState: PLAYER_STATES.HEALTH.DEAD,
				onFloorComplete,
				onPlayerDeath,
				submitScore,
			}),
		);

		expect(mockUseFloorCompletionScoreSubmission).toHaveBeenCalledWith({
			activeStateLabel: "done",
			authenticatedProfile: { id: "user-convex-id" },
			discoveredRooms: [ROOM_IDS.ENTRANCE, ROOM_IDS.LIBRARY],
			onFloorComplete,
			submitScore,
		});
		expect(mockUsePlayerDeathHaptic).toHaveBeenCalledWith({
			deadState: PLAYER_STATES.HEALTH.DEAD,
			healthState: PLAYER_STATES.HEALTH.DEAD,
			onPlayerDeath,
		});
	});
});
