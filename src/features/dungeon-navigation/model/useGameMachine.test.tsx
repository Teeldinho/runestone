// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { DUNGEON_EVENTS, ROOM_IDS } from "@/entities/dungeon";
import { DungeonGameMachineProvider } from "@/features/dungeon-navigation";
import { useGameMachine } from "@/features/dungeon-navigation/model/useGameMachine";

const gameMachineRuntimeWrapper = ({ children }: { children: ReactNode }) => (
	<DungeonGameMachineProvider>{children}</DungeonGameMachineProvider>
);

describe("useGameMachine", () => {
	it("returns an entrance snapshot by default", () => {
		const { result } = renderHook(() => useGameMachine(), {
			wrapper: gameMachineRuntimeWrapper,
		});

		expect(result.current.snapshot.value).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.snapshot.context.currentRoomId).toBe(
			ROOM_IDS.ENTRANCE,
		);
	});

	it("moves machine state through handleDungeonEventSend", () => {
		const { result } = renderHook(() => useGameMachine(), {
			wrapper: gameMachineRuntimeWrapper,
		});
		const libraryAction = result.current.actionButtons.find(
			(actionButton) => actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
		);

		act(() => {
			libraryAction?.handleDungeonActionTrigger();
		});

		expect(result.current.snapshot.value).toBe(ROOM_IDS.LIBRARY);
	});

	it("resets machine state to entrance", () => {
		const { result } = renderHook(() => useGameMachine(), {
			wrapper: gameMachineRuntimeWrapper,
		});
		const libraryAction = result.current.actionButtons.find(
			(actionButton) => actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
		);

		act(() => {
			libraryAction?.handleDungeonActionTrigger();
			result.current.handleDungeonRunReset();
		});

		expect(result.current.snapshot.value).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.snapshot.context.discoveredRooms).toEqual([
			ROOM_IDS.ENTRANCE,
		]);
	});

	it("exposes action button state derived from the machine snapshot", () => {
		const { result } = renderHook(() => useGameMachine(), {
			wrapper: gameMachineRuntimeWrapper,
		});

		const defaultLibraryAction = result.current.actionButtons.find(
			(actionButton) => actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
		);
		const defaultGuardRoomAction = result.current.actionButtons.find(
			(actionButton) =>
				actionButton.eventType === DUNGEON_EVENTS.ENTER_GUARD_ROOM,
		);

		expect(defaultLibraryAction?.isDisabled).toBe(false);
		expect(defaultGuardRoomAction?.isDisabled).toBe(true);

		act(() => {
			defaultLibraryAction?.handleDungeonActionTrigger();
		});

		const libraryGuardRoomAction = result.current.actionButtons.find(
			(actionButton) =>
				actionButton.eventType === DUNGEON_EVENTS.ENTER_GUARD_ROOM,
		);

		expect(libraryGuardRoomAction?.isDisabled).toBe(false);
	});
});
