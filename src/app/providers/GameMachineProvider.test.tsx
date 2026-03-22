// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { DUNGEON_EVENTS, ROOM_IDS } from "@/entities/dungeon";
import { useGameMachine } from "@/features/dungeon-navigation";

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

				return {
					primaryRuntime,
					secondaryRuntime,
				};
			},
			{
				wrapper: gameMachineProviderWrapper,
			},
		);

		expect(result.current.primaryRuntime.snapshot.value).toBe(
			ROOM_IDS.ENTRANCE,
		);
		expect(result.current.secondaryRuntime.snapshot.value).toBe(
			ROOM_IDS.ENTRANCE,
		);

		act(() => {
			result.current.primaryRuntime.handleDungeonEventSend(
				DUNGEON_EVENTS.ENTER_LIBRARY,
			);
		});

		expect(result.current.primaryRuntime.snapshot.value).toBe(ROOM_IDS.LIBRARY);
		expect(result.current.secondaryRuntime.snapshot.value).toBe(
			ROOM_IDS.LIBRARY,
		);
	});
});
