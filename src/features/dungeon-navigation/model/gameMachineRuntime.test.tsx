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
	selectCurrentRoomId,
	selectNearInteractable,
	useGameMachineRuntime,
	useGameMachineSelector,
	useSendDungeonMachineEvent,
} from "./gameMachineRuntime";

const gameMachineRuntimeWrapper = ({ children }: { children: ReactNode }) => (
	<DungeonGameMachineProvider>{children}</DungeonGameMachineProvider>
);

let sendDungeonMachineEventRef: ReturnType<
	typeof useSendDungeonMachineEvent
> | null = null;

const RuntimeBridge = () => {
	sendDungeonMachineEventRef = useSendDungeonMachineEvent();
	return null;
};

const selectorRuntimeWrapper = ({ children }: { children: ReactNode }) => (
	<DungeonGameMachineProvider>
		<RuntimeBridge />
		{children}
	</DungeonGameMachineProvider>
);

describe("useGameMachineRuntime", () => {
	it("throws when the runtime hook is used without its provider", () => {
		expect(() => renderHook(() => useGameMachineRuntime())).toThrowError();
	});

	it("provides a live machine snapshot and dispatcher", () => {
		const { result } = renderHook(() => useGameMachineRuntime(), {
			wrapper: gameMachineRuntimeWrapper,
		});

		expect(result.current.snapshot.value).toBe(ROOM_IDS.ENTRANCE);

		act(() => {
			result.current.sendDungeonMachineEvent({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
				interactableType: INTERACTION_TYPES.DOOR,
			});
			result.current.sendDungeonMachineEvent({
				type: DUNGEON_EVENTS.ENTER_LIBRARY,
			});
		});

		expect(result.current.snapshot.value).toBe(ROOM_IDS.LIBRARY);
	});

	it("subscribes consumers only to the selected room state", () => {
		let renderCount = 0;

		const { result } = renderHook(
			() => {
				renderCount += 1;
				return useGameMachineSelector(selectCurrentRoomId);
			},
			{
				wrapper: selectorRuntimeWrapper,
			},
		);

		expect(result.current).toBe(ROOM_IDS.ENTRANCE);
		expect(renderCount).toBe(1);

		act(() => {
			sendDungeonMachineEventRef?.({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
				interactableType: INTERACTION_TYPES.DOOR,
			});
		});

		expect(renderCount).toBe(1);
		expect(result.current).toBe(ROOM_IDS.ENTRANCE);
	});

	it("updates selector subscribers when the selected interactable changes", () => {
		const { result } = renderHook(
			() => useGameMachineSelector(selectNearInteractable),
			{
				wrapper: selectorRuntimeWrapper,
			},
		);

		expect(result.current).toBeNull();

		act(() => {
			sendDungeonMachineEventRef?.({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
				interactableType: INTERACTION_TYPES.DOOR,
			});
		});

		expect(result.current).toBe(
			buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
		);
	});
});
