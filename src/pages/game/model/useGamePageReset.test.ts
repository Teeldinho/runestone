// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PLAYER_ENTITY_CONFIG, PLAYER_EVENTS } from "@/entities/player";

import { useGamePageReset } from "./useGamePageReset";

const {
	mockCreateFloorOneMachine,
	mockCreateDungeonFloorLayout,
	mockSetPlayerTeleportTarget,
} = vi.hoisted(() => ({
	mockCreateFloorOneMachine: vi.fn(() => ({})),
	mockCreateDungeonFloorLayout: vi.fn(() => ({
		rooms: [
			{
				roomId: "entrance",
				position: [4, 0, 9],
				isInitial: true,
			},
		],
		corridors: [],
		transitions: [],
	})),
	mockSetPlayerTeleportTarget: vi.fn(),
}));

vi.mock("@/entities/dungeon", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/dungeon")>();

	return {
		...actual,
		createFloorOneMachine: mockCreateFloorOneMachine,
	};
});

vi.mock("@/entities/room", () => ({
	createDungeonFloorLayout: mockCreateDungeonFloorLayout,
}));

vi.mock("@/shared/lib", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/shared/lib")>();

	return {
		...actual,
		setPlayerTeleportTarget: mockSetPlayerTeleportTarget,
	};
});

describe("useGamePageReset", () => {
	it("restarts player, teleports to entrance and resets dungeon machine", () => {
		const sendPlayerMachineEvent = vi.fn();
		const resetDungeonMachine = vi.fn();

		const { result } = renderHook(() =>
			useGamePageReset({
				resetDungeonMachine,
				sendPlayerMachineEvent,
			}),
		);

		act(() => {
			result.current.handleDungeonRunReset();
		});

		expect(sendPlayerMachineEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENTS.RESTART,
		});
		expect(mockSetPlayerTeleportTarget).toHaveBeenCalledWith(
			4,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			9,
		);
		expect(resetDungeonMachine).toHaveBeenCalledTimes(1);
	});

	it("falls back to origin when entrance room is missing", () => {
		mockCreateDungeonFloorLayout.mockReturnValueOnce({
			rooms: [],
			corridors: [],
			transitions: [],
		});

		const sendPlayerMachineEvent = vi.fn();
		const resetDungeonMachine = vi.fn();

		const { result } = renderHook(() =>
			useGamePageReset({
				resetDungeonMachine,
				sendPlayerMachineEvent,
			}),
		);

		act(() => {
			result.current.handleDungeonRunReset();
		});

		expect(mockSetPlayerTeleportTarget).toHaveBeenCalledWith(
			0,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			0,
		);
	});
});
