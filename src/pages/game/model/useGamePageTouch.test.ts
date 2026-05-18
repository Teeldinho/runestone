// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { DungeonEvent } from "@/entities/dungeon";
import {
	useInteractionCandidates,
	useInteractionInput,
} from "@/features/dungeon-navigation";

import { useGamePageTouch } from "./useGamePageTouch";

const mockHandleAttack = vi.fn();
const mockHandleInteract = vi.fn();

vi.mock("@/features/dungeon-navigation", () => ({
	useInteractionCandidates: vi.fn(() => ({
		interactPrompt: "Open",
		interactEvent: "OPEN_DOOR",
		interactTargetId: "door-1",
		attackPrompt: "Attack",
		attackPosition: [1, 2, 3],
		hasInteract: true,
		hasAttack: true,
	})),
	useInteractionInput: vi.fn(() => ({
		handleAttack: mockHandleAttack,
		handleInteract: mockHandleInteract,
	})),
}));

describe("useGamePageTouch", () => {
	it("maps touch handlers to dungeon and player interactions", () => {
		const handleDungeonEventSend = vi.fn();

		const { result } = renderHook(() =>
			useGamePageTouch({
				handleDungeonEventSend,
			}),
		);

		act(() => {
			result.current.handleTouchAttack();
			result.current.handleTouchInteract();
		});
		expect(mockHandleAttack).toHaveBeenCalledTimes(1);
		expect(mockHandleInteract).toHaveBeenCalledTimes(1);
		expect(result.current.hasTouchAttack).toBe(true);
		expect(result.current.hasTouchInteract).toBe(true);
		expect(result.current.touchAttackPrompt).toBe("Attack");
		expect(result.current.touchInteractPrompt).toBe("Open");

		expect(vi.mocked(useInteractionCandidates)).toHaveBeenCalledTimes(1);
		expect(vi.mocked(useInteractionInput)).toHaveBeenCalledWith(
			expect.objectContaining({
				candidates: expect.objectContaining({
					hasAttack: true,
					hasInteract: true,
				}),
				enableKeyboardBindings: false,
				sendDungeonMachineEvent: expect.any(Function),
			}),
		);

		const sendDungeonMachineEvent =
			vi.mocked(useInteractionInput).mock.calls[0]?.[0].sendDungeonMachineEvent;

		if (!sendDungeonMachineEvent) {
			throw new Error("Expected sendDungeonMachineEvent handler");
		}

		act(() => {
			sendDungeonMachineEvent({ type: "OPEN_DOOR" as DungeonEvent });
		});

		expect(handleDungeonEventSend).toHaveBeenCalledWith("OPEN_DOOR");
	});
});
