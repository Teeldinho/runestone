// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import {
	buildDoorKey,
	DOOR_SIDES,
	DUNGEON_EVENTS,
	INTERACTION_TYPES,
	ROOM_IDS,
} from "@/entities/dungeon";
import {
	DungeonGameMachineProvider,
	useGameMachineRuntime,
} from "@/features/dungeon-navigation";
import { useGameMachine } from "@/features/dungeon-navigation/model/useGameMachine";

const gameMachineRuntimeWrapper = ({ children }: { children: ReactNode }) => (
	<DungeonGameMachineProvider>{children}</DungeonGameMachineProvider>
);

describe("useGameMachine", () => {
	it("returns entrance-derived machine view data by default", () => {
		const { result } = renderHook(() => useGameMachine(), {
			wrapper: gameMachineRuntimeWrapper,
		});

		expect(result.current.machine.activeStateLabel).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.room.currentRoomId).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.room.currentRoomLabel).toBe("Entrance");
		expect(result.current.room.discoveredRoomLabels).toEqual(["Entrance"]);
		expect(result.current.status.nearInteractableLabel).toBe("—");
	});

	it("moves machine state through handleDungeonEventSend", () => {
		const { result } = renderHook(
			() => ({
				gameMachine: useGameMachine(),
				runtime: useGameMachineRuntime(),
			}),
			{
				wrapper: gameMachineRuntimeWrapper,
			},
		);
		const libraryAction = result.current.gameMachine.navigation.actionButtons.find(
			(actionButton) => actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
		);

		act(() => {
			result.current.runtime.sendDungeonMachineEvent({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
				interactableType: INTERACTION_TYPES.DOOR,
			});
			libraryAction?.handleDungeonActionTrigger();
		});

		expect(result.current.gameMachine.room.currentRoomId).toBe(ROOM_IDS.LIBRARY);
		expect(result.current.gameMachine.machine.activeStateLabel).toBe(
			ROOM_IDS.LIBRARY,
		);
	});

	it("resets machine state to entrance", () => {
		const { result } = renderHook(
			() => ({
				gameMachine: useGameMachine(),
				runtime: useGameMachineRuntime(),
			}),
			{
				wrapper: gameMachineRuntimeWrapper,
			},
		);
		const libraryAction = result.current.gameMachine.navigation.actionButtons.find(
			(actionButton) => actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
		);

		act(() => {
			result.current.runtime.sendDungeonMachineEvent({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
				interactableType: INTERACTION_TYPES.DOOR,
			});
			libraryAction?.handleDungeonActionTrigger();
			result.current.gameMachine.navigation.handleDungeonRunReset();
		});

		expect(result.current.gameMachine.machine.activeStateLabel).toBe(
			ROOM_IDS.ENTRANCE,
		);
		expect(result.current.gameMachine.room.discoveredRooms).toEqual([
			ROOM_IDS.ENTRANCE,
		]);
	});

	it("exposes action button state derived from the machine snapshot", () => {
		const { result } = renderHook(
			() => ({
				gameMachine: useGameMachine(),
				runtime: useGameMachineRuntime(),
			}),
			{
				wrapper: gameMachineRuntimeWrapper,
			},
		);

		const defaultLibraryAction =
			result.current.gameMachine.navigation.actionButtons.find(
			(actionButton) => actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
		);
		const defaultGuardRoomAction =
			result.current.gameMachine.navigation.actionButtons.find(
				(actionButton) =>
					actionButton.eventType === DUNGEON_EVENTS.ENTER_GUARD_ROOM,
			);

		expect(defaultLibraryAction?.isDisabled).toBe(true);
		expect(defaultGuardRoomAction?.isDisabled).toBe(true);

		act(() => {
			result.current.runtime.sendDungeonMachineEvent({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
				interactableType: INTERACTION_TYPES.DOOR,
			});
		});

		const enabledLibraryAction =
			result.current.gameMachine.navigation.actionButtons.find(
			(actionButton) => actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
		);

		expect(enabledLibraryAction?.isDisabled).toBe(false);

		act(() => {
			defaultLibraryAction?.handleDungeonActionTrigger();
		});

		const libraryGuardRoomAction =
			result.current.gameMachine.navigation.actionButtons.find(
				(actionButton) =>
					actionButton.eventType === DUNGEON_EVENTS.ENTER_GUARD_ROOM,
			);

		expect(libraryGuardRoomAction?.isDisabled).toBe(true);

		act(() => {
			result.current.runtime.sendDungeonMachineEvent({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: buildDoorKey(ROOM_IDS.LIBRARY, DOOR_SIDES.SOUTH),
				interactableType: INTERACTION_TYPES.DOOR,
			});
		});

		const enabledGuardRoomAction =
			result.current.gameMachine.navigation.actionButtons.find(
				(actionButton) =>
					actionButton.eventType === DUNGEON_EVENTS.ENTER_GUARD_ROOM,
			);

		expect(enabledGuardRoomAction?.isDisabled).toBe(false);
	});
});
