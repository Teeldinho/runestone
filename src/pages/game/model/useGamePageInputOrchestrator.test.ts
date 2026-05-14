// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CAMERA_EVENT_TYPES } from "@/shared/config";

const mocks = vi.hoisted(() => {
	const canonicalCameraActorRef = { send: vi.fn() };
	const gameActorRef = { send: vi.fn() };
	const inputSend = vi.fn();
	const playerActorRef = { send: vi.fn() };
	const useGamePageMachineState = vi.fn();
	const useGamePageCanvasContext = vi.fn(() => ({
		cameraActorRef: canonicalCameraActorRef,
	}));

	return {
		canonicalCameraActorRef,
		gameActorRef,
		inputSend,
		playerActorRef,
		useGamePageCanvasContext,
		useGamePageMachineState,
	};
});

vi.mock("@/entities/player", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/player")>();

	return {
		...actual,
		usePlayerMachineRuntime: () => ({
			playerActorRef: mocks.playerActorRef,
			snapshot: {
				value: {
					[actual.PLAYER_STATES.REGIONS.AIRBORNE]:
						actual.PLAYER_STATES.AIRBORNE.GROUNDED,
				},
			},
		}),
	};
});

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachineActorRef: () => mocks.gameActorRef,
}));

vi.mock("@/features/input-orchestrator", () => ({
	useInputOrchestrator: vi.fn(({ cameraRef }) => {
		cameraRef.send({
			type: CAMERA_EVENT_TYPES.LOOK_CHANGED,
			delta: { x: 1, y: -1 },
		});

		return {
			isDesktopRunHeld: false,
			isMobileRunToggled: false,
			sendInput: mocks.inputSend,
		};
	}),
	useKeyboardInputOrchestrator: vi.fn(),
	useTouchLookInput: vi.fn(() => ({
		handlePointerCancel: vi.fn(),
		handlePointerDown: vi.fn(),
		handlePointerMove: vi.fn(),
		handlePointerUp: vi.fn(),
	})),
	useTouchMovementInput: vi.fn(() => ({
		handleMoveVelocity: vi.fn(),
		handleStopVelocity: vi.fn(),
	})),
}));

vi.mock("./useGamePageMachineState", () => ({
	useGamePageMachineState: mocks.useGamePageMachineState,
}));

vi.mock("./useGamePageSliceContexts", () => ({
	useGamePageCanvasContext: mocks.useGamePageCanvasContext,
}));

import { useGamePageInputOrchestrator } from "./useGamePageInputOrchestrator";

describe("useGamePageInputOrchestrator", () => {
	it("routes look input to the canonical canvas camera actor", () => {
		const { result } = renderHook(() => useGamePageInputOrchestrator());

		expect(mocks.useGamePageMachineState).not.toHaveBeenCalled();
		expect(mocks.useGamePageCanvasContext).toHaveBeenCalledTimes(1);
		expect(mocks.canonicalCameraActorRef.send).toHaveBeenCalledWith({
			type: CAMERA_EVENT_TYPES.LOOK_CHANGED,
			delta: { x: 1, y: -1 },
		});
		expect(result.current.isJumpActive).toBe(false);
	});
});
