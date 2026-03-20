import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DUNGEON_EVENTS, ROOM_IDS } from "@/entities/dungeon";
import { useGameMachine } from "@/features/dungeon-navigation/model/useGameMachine";

describe("useGameMachine", () => {
	it("returns an entrance snapshot by default", () => {
		const { result } = renderHook(() => useGameMachine());

		expect(result.current.snapshot.value).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.snapshot.context.currentRoomId).toBe(
			ROOM_IDS.ENTRANCE,
		);
	});

	it("moves machine state through sendDungeonEvent", () => {
		const { result } = renderHook(() => useGameMachine());

		act(() => {
			result.current.sendDungeonEvent(DUNGEON_EVENTS.ENTER_LIBRARY);
		});

		expect(result.current.snapshot.value).toBe(ROOM_IDS.LIBRARY);
	});

	it("resets machine state to entrance", () => {
		const { result } = renderHook(() => useGameMachine());

		act(() => {
			result.current.sendDungeonEvent(DUNGEON_EVENTS.ENTER_LIBRARY);
			result.current.resetDungeonRun();
		});

		expect(result.current.snapshot.value).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.snapshot.context.discoveredRooms).toEqual([
			ROOM_IDS.ENTRANCE,
		]);
	});
});
