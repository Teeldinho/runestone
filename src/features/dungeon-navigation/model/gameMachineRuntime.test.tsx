// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { DUNGEON_EVENTS, ROOM_IDS } from "@/entities/dungeon";
import { GAME_MACHINE_RUNTIME_ERRORS } from "@/features/dungeon-navigation/config";

import {
	DungeonGameMachineProvider,
	useGameMachineRuntime,
} from "./gameMachineRuntime";

const gameMachineRuntimeWrapper = ({ children }: { children: ReactNode }) => (
	<DungeonGameMachineProvider>{children}</DungeonGameMachineProvider>
);

describe("useGameMachineRuntime", () => {
	it("throws when the runtime hook is used without its provider", () => {
		expect(() => renderHook(() => useGameMachineRuntime())).toThrowError(
			GAME_MACHINE_RUNTIME_ERRORS.MISSING_PROVIDER,
		);
	});

	it("provides a live machine snapshot and dispatcher", () => {
		const { result } = renderHook(() => useGameMachineRuntime(), {
			wrapper: gameMachineRuntimeWrapper,
		});

		expect(result.current.snapshot.value).toBe(ROOM_IDS.ENTRANCE);

		act(() => {
			result.current.sendDungeonMachineEvent({
				type: DUNGEON_EVENTS.ENTER_LIBRARY,
			});
		});

		expect(result.current.snapshot.value).toBe(ROOM_IDS.LIBRARY);
	});
});
