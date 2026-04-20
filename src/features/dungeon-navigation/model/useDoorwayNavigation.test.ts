// @vitest-environment happy-dom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
	DUNGEON_EVENTS,
	type DungeonInteractableId,
	INTERACTION_TYPES,
	ROOM_IDS,
} from "@/entities/dungeon";
import { setPlayerPosition } from "@/shared/lib";

const mockRuntimeContext = vi.hoisted(() => ({
	currentRoomId: null as string | null,
	enemiesRemaining: 1,
	hasTreasureKey: false,
}));

const mockSendDungeonMachineEvent = vi.hoisted(() => vi.fn());
const mockResolveNearInteractableTarget = vi.hoisted(() => vi.fn());

vi.mock("../lib", async (importOriginal) => {
	const original = await importOriginal<typeof import("../lib")>();

	return {
		...original,
		resolveNearInteractableTarget: mockResolveNearInteractableTarget,
	};
});

vi.mock("./gameMachineRuntime", async (importOriginal) => {
	const original =
		await importOriginal<typeof import("./gameMachineRuntime")>();

	return {
		...original,
		selectDoorwayNavigationContext: vi.fn(),
		useGameMachineSelector: () => mockRuntimeContext,
		useSendDungeonMachineEvent: () => mockSendDungeonMachineEvent,
	};
});

import { useDoorwayNavigation } from "./useDoorwayNavigation";

const MOCK_DOOR_INTERACTABLE_ID = "guard-room:north" as DungeonInteractableId;

describe("useDoorwayNavigation", () => {
	beforeEach(() => {
		mockRuntimeContext.currentRoomId = ROOM_IDS.GUARD_ROOM;
		setPlayerPosition(0, 0, 0);
		mockSendDungeonMachineEvent.mockReset();
		mockResolveNearInteractableTarget.mockImplementation(
			({ playerPosition }: { playerPosition: [number, number, number] }) => {
				if (playerPosition[0] >= 1) {
					return {
						interactableId: MOCK_DOOR_INTERACTABLE_ID,
						interactableType: INTERACTION_TYPES.DOOR,
					};
				}

				return null;
			},
		);
	});

	it("sends NEAR_INTERACTABLE and LEFT_INTERACTABLE during doorway range transitions", async () => {
		renderHook(() => useDoorwayNavigation());

		act(() => {
			setPlayerPosition(1, 0, 0);
		});

		await waitFor(() => {
			expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: MOCK_DOOR_INTERACTABLE_ID,
				interactableType: INTERACTION_TYPES.DOOR,
			});
		});

		act(() => {
			setPlayerPosition(0, 0, 0);
		});

		await waitFor(() => {
			expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
				type: DUNGEON_EVENTS.LEFT_INTERACTABLE,
				interactableId: MOCK_DOOR_INTERACTABLE_ID,
			});
		});
	});

	it("does not resend NEAR_INTERACTABLE while staying on the same interactable", async () => {
		renderHook(() => useDoorwayNavigation());

		act(() => {
			setPlayerPosition(1, 0, 0);
		});

		await waitFor(() => {
			expect(mockSendDungeonMachineEvent).toHaveBeenCalledWith({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: MOCK_DOOR_INTERACTABLE_ID,
				interactableType: INTERACTION_TYPES.DOOR,
			});
		});

		const initialNearInteractableCallCount =
			mockSendDungeonMachineEvent.mock.calls.filter(
				([event]) => event.type === DUNGEON_EVENTS.NEAR_INTERACTABLE,
			).length;

		act(() => {
			setPlayerPosition(2, 0, 0);
		});

		await waitFor(() => {
			const nearInteractableCallCount =
				mockSendDungeonMachineEvent.mock.calls.filter(
					([event]) => event.type === DUNGEON_EVENTS.NEAR_INTERACTABLE,
				).length;

			expect(nearInteractableCallCount).toBe(initialNearInteractableCallCount);
		});
	});
});
