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
	useGameMachine,
	useGameMachineRuntime,
} from "@/features/dungeon-navigation";

import { GameMachineProvider } from "./GameMachineProvider";

const gameMachineProviderWrapper = ({ children }: { children: ReactNode }) => (
	<GameMachineProvider>{children}</GameMachineProvider>
);

describe("GameMachineProvider", () => {
	it("shares one dungeon machine runtime across descendant hooks", () => {
		const { result } = renderHook(
			() => {
				const primaryRuntime = useGameMachine();
				const secondaryRuntime = useGameMachine();
				const machineRuntime = useGameMachineRuntime();

				return {
					machineRuntime,
					primaryRuntime,
					secondaryRuntime,
				};
			},
			{
				wrapper: gameMachineProviderWrapper,
			},
		);

		expect(result.current.primaryRuntime.currentRoomId).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.secondaryRuntime.currentRoomId).toBe(
			ROOM_IDS.ENTRANCE,
		);

		act(() => {
			result.current.machineRuntime.sendDungeonMachineEvent({
				type: DUNGEON_EVENTS.NEAR_INTERACTABLE,
				interactableId: buildDoorKey(ROOM_IDS.ENTRANCE, DOOR_SIDES.SOUTH),
				interactableType: INTERACTION_TYPES.DOOR,
			});
			const libraryAction = result.current.primaryRuntime.actionButtons.find(
				(actionButton) =>
					actionButton.eventType === DUNGEON_EVENTS.ENTER_LIBRARY,
			);
			libraryAction?.handleDungeonActionTrigger();
		});

		expect(result.current.primaryRuntime.currentRoomId).toBe(ROOM_IDS.LIBRARY);
		expect(result.current.secondaryRuntime.currentRoomId).toBe(
			ROOM_IDS.LIBRARY,
		);
	});
});
