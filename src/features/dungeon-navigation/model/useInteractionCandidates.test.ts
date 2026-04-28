// @vitest-environment happy-dom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";
import {
	clearEnemyPositions,
	setEnemyPosition,
	setPlayerPosition,
} from "@/shared/lib";

const mockRuntimeContext = vi.hoisted(() => ({
	currentRoomId: null as string | null,
	enemiesRemaining: 0,
	hasTreasureKey: false,
	nearInteractable: null,
}));

vi.mock("./gameMachineRuntime", async (importOriginal) => {
	const original =
		await importOriginal<typeof import("./gameMachineRuntime")>();

	return {
		...original,
		selectInteractionCandidatesContext: vi.fn(),
		useGameMachineSelector: () => mockRuntimeContext,
	};
});

import { useInteractionCandidates } from "./useInteractionCandidates";

describe("useInteractionCandidates", () => {
	beforeEach(() => {
		mockRuntimeContext.currentRoomId = ROOM_IDS.GUARD_ROOM;
		mockRuntimeContext.enemiesRemaining = 1;
		mockRuntimeContext.hasTreasureKey = true;
		mockRuntimeContext.nearInteractable = null;
		clearEnemyPositions();
		setPlayerPosition(0, 1, 0);
	});

	it("tracks live enemy positions for attack prompts", async () => {
		setEnemyPosition("enemy-1", 0, 1, 0.5);

		const { result } = renderHook(() => useInteractionCandidates());

		await waitFor(() => {
			expect(result.current.hasAttack).toBe(true);
		});
		expect(result.current.attackPosition).toEqual([0, 1, 0.5]);

		act(() => {
			setEnemyPosition("enemy-1", 2.5, 1, 0);
		});

		await waitFor(() => {
			expect(result.current.hasAttack).toBe(false);
		});
	});
});
