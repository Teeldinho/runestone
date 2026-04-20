// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import { PLAYER_STATES, usePlayerMachineRuntime } from "@/entities/player";
import { CAMERA_MODES, useCameraMachine } from "@/features/camera-system";
import { useGameMachine } from "@/features/dungeon-navigation";
import { useResponsiveGameLayout } from "@/features/responsive-layout";

import { useGamePageMachineState } from "./useGamePageMachineState";

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachine: vi.fn(),
}));

vi.mock("@/entities/player", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/player")>();

	return {
		...actual,
		usePlayerMachineRuntime: vi.fn(),
	};
});

vi.mock("@/features/camera-system", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/features/camera-system")>();

	return {
		...actual,
		useCameraMachine: vi.fn(),
	};
});

vi.mock("@/features/responsive-layout", () => ({
	useResponsiveGameLayout: vi.fn(),
}));

describe("useGamePageMachineState", () => {
	it("composes machine snapshots and derives mobile landscape flag", () => {
		const handleDungeonEventSend = vi.fn();
		const handleDungeonRunReset = vi.fn();
		const sendPlayerMachineEvent = vi.fn();
		const handleCameraModeSwitch = vi.fn();

		vi.mocked(useGameMachine).mockReturnValue({
			activeStateLabel: ROOM_IDS.ENTRANCE,
			actionButtons: [],
			currentRoomId: ROOM_IDS.ENTRANCE,
			currentRoomLabel: ROOM_LABELS[ROOM_IDS.ENTRANCE],
			discoveredRoomLabels: [ROOM_LABELS[ROOM_IDS.ENTRANCE]],
			enemiesRemaining: 2,
			handleDungeonEventSend,
			handleDungeonRunReset,
			hasTreasureKey: false,
			nearInteractableLabel: "—",
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(usePlayerMachineRuntime).mockReturnValue({
			snapshot: {
				value: {
					health: PLAYER_STATES.HEALTH.ALIVE,
					movement: PLAYER_STATES.MOVEMENT.IDLE,
				},
				context: {
					stats: {
						hp: 88,
						maxHp: 100,
					},
				},
			},
			sendPlayerMachineEvent,
		} as unknown as ReturnType<typeof usePlayerMachineRuntime>);

		vi.mocked(useCameraMachine).mockReturnValue({
			cameraStateSnapshot: {
				fov: 58,
				mode: CAMERA_MODES.FREE_ORBITAL,
				position: [0, 0, 0],
				target: [0, 0, 0],
				zoom: 1,
			},
			handleCameraModeSwitch,
			mode: CAMERA_MODES.FREE_ORBITAL,
		} as unknown as ReturnType<typeof useCameraMachine>);

		vi.mocked(useResponsiveGameLayout).mockReturnValue({
			isDesktopLayout: false,
			isLandscape: true,
			isMobileLayout: true,
			isPortrait: false,
			isTabletLayout: false,
		} as unknown as ReturnType<typeof useResponsiveGameLayout>);

		const { result } = renderHook(() => useGamePageMachineState());

		expect(result.current.gameMachine.currentRoomId).toBe(ROOM_IDS.ENTRANCE);
		expect(result.current.playerMachine.sendPlayerMachineEvent).toBe(
			sendPlayerMachineEvent,
		);
		expect(result.current.cameraMachine.handleCameraModeSwitch).toBe(
			handleCameraModeSwitch,
		);
		expect(result.current.layout.isMobileTabletLandscape).toBe(true);
	});
});
