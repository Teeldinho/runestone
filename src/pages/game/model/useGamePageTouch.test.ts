// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePlayerMachineRuntime } from "@/entities/player";
import {
	useGameMachine,
	useInteractionCandidates,
	useInteractionInput,
} from "@/features/dungeon-navigation";

import { useGamePageTouch } from "./useGamePageTouch";

vi.mock("@/entities/player", () => ({
	PLAYER_EVENTS: {
		MOVE: "MOVE",
		STOP: "STOP",
		RESTART: "RESTART",
	},
	usePlayerMachineRuntime: vi.fn(() => ({
		sendPlayerMachineEvent: vi.fn(),
	})),
}));

vi.mock("@/features/dungeon-navigation", () => ({
	useGameMachine: vi.fn(),
	useInteractionCandidates: vi.fn(),
	useInteractionInput: vi.fn(),
}));

describe("useGamePageTouch", () => {
	it("returns touch interaction candidates", () => {
		vi.mocked(useInteractionCandidates).mockReturnValue({
			attackPosition: null,
			attackPrompt: "Attack",
			hasAttack: true,
			hasInteract: true,
			interactEvent: null,
			interactPrompt: "Interact",
			interactTargetId: null,
		});

		vi.mocked(useInteractionInput).mockReturnValue({
			handleAttack: vi.fn(),
			handleInteract: vi.fn(),
		});

		vi.mocked(useGameMachine).mockReturnValue({
			handleDungeonEventSend: vi.fn(),
		} as unknown as ReturnType<typeof useGameMachine>);

		const { result } = renderHook(() => useGamePageTouch());

		expect(result.current.hasTouchAttack).toBe(true);
		expect(result.current.hasTouchInteract).toBe(true);
		expect(result.current.touchAttackPrompt).toBe("Attack");
		expect(result.current.touchInteractPrompt).toBe("Interact");
	});

	it("returns null prompts when no interactions available", () => {
		vi.mocked(useInteractionCandidates).mockReturnValue({
			attackPosition: null,
			attackPrompt: null,
			hasAttack: false,
			hasInteract: false,
			interactEvent: null,
			interactPrompt: null,
			interactTargetId: null,
		});

		vi.mocked(useInteractionInput).mockReturnValue({
			handleAttack: vi.fn(),
			handleInteract: vi.fn(),
		});

		vi.mocked(useGameMachine).mockReturnValue({
			handleDungeonEventSend: vi.fn(),
		} as unknown as ReturnType<typeof useGameMachine>);

		const { result } = renderHook(() => useGamePageTouch());

		expect(result.current.hasTouchAttack).toBe(false);
		expect(result.current.hasTouchInteract).toBe(false);
		expect(result.current.touchAttackPrompt).toBeNull();
		expect(result.current.touchInteractPrompt).toBeNull();
	});

	it("returns touch handlers", () => {
		const handleAttack = vi.fn();
		const handleInteract = vi.fn();

		vi.mocked(useInteractionCandidates).mockReturnValue({
			attackPosition: null,
			attackPrompt: null,
			hasAttack: false,
			hasInteract: false,
			interactEvent: null,
			interactPrompt: null,
			interactTargetId: null,
		});

		vi.mocked(useInteractionInput).mockReturnValue({
			handleAttack,
			handleInteract,
		});

		vi.mocked(useGameMachine).mockReturnValue({
			handleDungeonEventSend: vi.fn(),
		} as unknown as ReturnType<typeof useGameMachine>);

		const { result } = renderHook(() => useGamePageTouch());

		expect(result.current.handleTouchAttack).toBe(handleAttack);
		expect(result.current.handleTouchInteract).toBe(handleInteract);
	});

	it("handles touch joystick move by sending player move event", () => {
		const sendPlayerMachineEvent = vi.fn();

		vi.mocked(useInteractionCandidates).mockReturnValue({
			attackPosition: null,
			attackPrompt: null,
			hasAttack: false,
			hasInteract: false,
			interactEvent: null,
			interactPrompt: null,
			interactTargetId: null,
		});

		vi.mocked(useInteractionInput).mockReturnValue({
			handleAttack: vi.fn(),
			handleInteract: vi.fn(),
		});

		vi.mocked(useGameMachine).mockReturnValue({
			handleDungeonEventSend: vi.fn(),
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(usePlayerMachineRuntime).mockReturnValue({
			sendPlayerMachineEvent,
		} as unknown as ReturnType<typeof usePlayerMachineRuntime>);

		const { result } = renderHook(() => useGamePageTouch());

		const velocity: [number, number, number] = [1, 0, 1];
		result.current.handleTouchJoystickMove(velocity);

		expect(sendPlayerMachineEvent).toHaveBeenCalledWith({
			type: "MOVE",
			velocity,
			isSprinting: false,
		});
	});

	it("handles touch joystick stop by sending player stop event", () => {
		const sendPlayerMachineEvent = vi.fn();

		vi.mocked(useInteractionCandidates).mockReturnValue({
			attackPosition: null,
			attackPrompt: null,
			hasAttack: false,
			hasInteract: false,
			interactEvent: null,
			interactPrompt: null,
			interactTargetId: null,
		});

		vi.mocked(useInteractionInput).mockReturnValue({
			handleAttack: vi.fn(),
			handleInteract: vi.fn(),
		});

		vi.mocked(useGameMachine).mockReturnValue({
			handleDungeonEventSend: vi.fn(),
		} as unknown as ReturnType<typeof useGameMachine>);

		vi.mocked(usePlayerMachineRuntime).mockReturnValue({
			sendPlayerMachineEvent,
		} as unknown as ReturnType<typeof usePlayerMachineRuntime>);

		const { result } = renderHook(() => useGamePageTouch());

		result.current.handleTouchJoystickStop();

		expect(sendPlayerMachineEvent).toHaveBeenCalledWith({ type: "STOP" });
	});
});
