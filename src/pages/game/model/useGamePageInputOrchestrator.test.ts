// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
	const gameActorRef = { send: vi.fn() };
	const inputSend = vi.fn();
	const inputStateKeys = {
		READY: "ready",
		MOVEMENT_REGION: "movementRegion",
		MOVEMENT_IDLE: "movementIdle",
		RUN_TOGGLE_REGION: "runToggleRegion",
		RUN_TOGGLE_OFF: "runToggleOff",
	} as const;
	const inputStateValue = {
		ready: {
			movementRegion: inputStateKeys.MOVEMENT_IDLE,
			runToggleRegion: inputStateKeys.RUN_TOGGLE_OFF,
		},
	};
	const playerActorRef = { send: vi.fn() };
	const useGamePageCanvasContext = vi.fn();

	return {
		gameActorRef,
		inputSend,
		inputStateValue,
		playerActorRef,
		useGamePageCanvasContext,
	};
});

vi.mock("@/entities/player", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/entities/player")>();

	return {
		...actual,
		usePlayerMachineRuntime: () => ({
			playerActorRef: mocks.playerActorRef,
		}),
	};
});

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachineActorRef: () => mocks.gameActorRef,
}));

vi.mock("@/features/input-orchestrator", () => ({
	useInputOrchestrator: vi.fn(({ playerRef, interactionRef }) => {
		expect(playerRef).toBe(mocks.playerActorRef);
		expect(interactionRef).toBe(mocks.gameActorRef);

		return {
			inputStateValue: mocks.inputStateValue,
			isRunToggled: false,
			sendInput: mocks.inputSend,
		};
	}),
	useKeyboardMovementInput: vi.fn(),
	useKeyboardInputOrchestrator: vi.fn(),
	useTouchMovementInput: vi.fn(() => ({
		handleMoveVelocity: vi.fn(),
		handleStopVelocity: vi.fn(),
	})),
}));

vi.mock("./useGamePageSliceContexts", () => ({
	useGamePageCanvasContext: mocks.useGamePageCanvasContext,
}));

import { useGamePageInputOrchestrator } from "./useGamePageInputOrchestrator";

describe("useGamePageInputOrchestrator", () => {
	it("binds player movement and interaction refs without camera look plumbing", () => {
		const { result } = renderHook(() => useGamePageInputOrchestrator());

		expect(mocks.useGamePageCanvasContext).not.toHaveBeenCalled();
		expect(result.current.inputStateValue).toBe(mocks.inputStateValue);
		expect(result.current.sendInput).toBe(mocks.inputSend);
		expect(result.current.touchMovement.handleMoveVelocity).toBeDefined();
	});
});
