// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	DOOR_SIDES,
	type LastTransition,
	ROOM_IDS,
	type RoomId,
} from "@/entities/dungeon";
import type { DungeonRoomLayout } from "@/entities/room";

const mockUseRoomTransitionHaptics = vi.fn();
const mockUseRoomArrivalTeleport = vi.fn();
const mockUseDoorwayGuardFeedback = vi.fn();

vi.mock("./useRoomTransitionHaptics", () => ({
	useRoomTransitionHaptics: (...args: unknown[]) =>
		mockUseRoomTransitionHaptics(...args),
}));

vi.mock("./useRoomArrivalTeleport", () => ({
	useRoomArrivalTeleport: (...args: unknown[]) =>
		mockUseRoomArrivalTeleport(...args),
}));

vi.mock("./useDoorwayGuardFeedback", () => ({
	useDoorwayGuardFeedback: (...args: unknown[]) =>
		mockUseDoorwayGuardFeedback(...args),
}));

import { useGameNavigationSideEffects } from "./useGameNavigationSideEffects";

const createFloorRooms = (): DungeonRoomLayout[] =>
	[
		{
			roomId: ROOM_IDS.ENTRANCE,
			label: "Entrance",
			position: [0, 0, 0] as [number, number, number],
			isInitial: true,
			isFinal: false,
		},
	] as DungeonRoomLayout[];

describe("useGameNavigationSideEffects", () => {
	it("delegates navigation snapshot data to room transition, teleport, and guard feedback hooks", () => {
		const currentRoomId: RoomId = ROOM_IDS.LIBRARY;
		const lastTransition: LastTransition = {
			fromRoom: ROOM_IDS.ENTRANCE,
			toRoom: ROOM_IDS.LIBRARY,
			doorSide: DOOR_SIDES.NORTH,
		};
		const onRoomEnter = vi.fn();
		const onTransition = vi.fn();
		const onGuardFail = vi.fn();
		const floorRooms = createFloorRooms();

		renderHook(() =>
			useGameNavigationSideEffects({
				currentRoomId,
				floorRooms,
				lastDoorwayFeedback: "LOCKED_DOOR_ATTEMPT",
				lastTransition,
				onGuardFail,
				onRoomEnter,
				onTransition,
				spawnHeightOffset: 0.45,
			}),
		);

		expect(mockUseRoomTransitionHaptics).toHaveBeenCalledWith({
			currentRoomId,
			onRoomEnter,
			onTransition,
		});
		expect(mockUseRoomArrivalTeleport).toHaveBeenCalledWith({
			currentRoomId,
			floorRooms,
			lastTransition,
			spawnHeightOffset: 0.45,
		});
		expect(mockUseDoorwayGuardFeedback).toHaveBeenCalledWith({
			lastDoorwayFeedback: "LOCKED_DOOR_ATTEMPT",
			onGuardFail,
		});
	});
});
