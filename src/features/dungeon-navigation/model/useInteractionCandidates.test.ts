// @vitest-environment happy-dom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROOM_IDS } from "@/entities/dungeon";
import {
	clearEnemyPositions,
	setEnemyPosition,
} from "@/shared/lib/enemyPositionStore";
import { setPlayerPosition } from "@/shared/lib/playerPositionStore";

const mockRuntimeContext = vi.hoisted(() => ({
	nearInteractable: null,
}));

vi.mock("@/features/dungeon-navigation", async (importOriginal) => {
	const original =
		await importOriginal<typeof import("@/features/dungeon-navigation")>();

	return {
		...original,
		useGameMachineRuntime: () => ({
			snapshot: {
				context: mockRuntimeContext,
			},
		}),
	};
});

import { useInteractionCandidates } from "./useInteractionCandidates";

describe("useInteractionCandidates", () => {
	beforeEach(() => {
		mockRuntimeContext.nearInteractable = null;
		clearEnemyPositions();
		setPlayerPosition(0, 1, 0);
	});

	it("tracks live enemy positions for attack prompts", async () => {
		setEnemyPosition("enemy-1", 0, 1, 0.5);

		const { result } = renderHook(() =>
			useInteractionCandidates({
				currentRoomId: ROOM_IDS.GUARD_ROOM,
				hasTreasureKey: true,
				enemiesRemaining: 1,
			}),
		);

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
