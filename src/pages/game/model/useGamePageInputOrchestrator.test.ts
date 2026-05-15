// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
	const gameActorRef = { send: vi.fn() };
	const inputSend = vi.fn();
	const playerActorRef = { send: vi.fn() };
	const useGamePageCanvasContext = vi.fn();

	return {
		gameActorRef,
		inputSend,
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
	useInputOrchestrator: vi.fn(({ playerRef, interactionRef }) => {
		expect(playerRef).toBe(mocks.playerActorRef);
		expect(interactionRef).toBe(mocks.gameActorRef);

		return {
			isDesktopRunHeld: false,
			isMobileRunToggled: false,
			sendInput: mocks.inputSend,
		};
	}),
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
		expect(result.current.isJumpActive).toBe(false);
		expect(result.current.sendInput).toBe(mocks.inputSend);
		expect(result.current.touchMovement.handleMoveVelocity).toBeDefined();
	});
});
