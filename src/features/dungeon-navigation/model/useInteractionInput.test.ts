// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DUNGEON_EVENTS } from "@/entities/dungeon";

import { INTERACTION_COOLDOWN_MS, INTERACTION_KEYS } from "../config";

import { useInteractionInput } from "./useInteractionInput";

const createCandidates = ({
	hasInteract = true,
	hasAttack = true,
	interactEvent = DUNGEON_EVENTS.PICK_UP_KEY,
}: {
	hasInteract?: boolean;
	hasAttack?: boolean;
	interactEvent?: string | null;
} = {}) => ({
	interactPrompt: hasInteract ? "Interact" : null,
	interactEvent: hasInteract
		? (interactEvent as typeof DUNGEON_EVENTS.PICK_UP_KEY)
		: null,
	interactTargetId: null,
	attackPrompt: hasAttack ? "Attack" : null,
	attackPosition: hasAttack ? ([0, 0, 0] as const) : null,
	hasInteract,
	hasAttack,
});

describe("useInteractionInput", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it("sends interact event when interact is available", () => {
		const sendDungeonMachineEvent = vi.fn();
		const { result } = renderHook(() =>
			useInteractionInput({
				candidates: createCandidates(),
				sendDungeonMachineEvent,
			}),
		);

		act(() => {
			result.current.handleInteract();
		});

		expect(sendDungeonMachineEvent).toHaveBeenCalledWith({
			type: DUNGEON_EVENTS.PICK_UP_KEY,
		});
	});

	it("blocks repeat interact events during cooldown", () => {
		const sendDungeonMachineEvent = vi.fn();
		const { result } = renderHook(() =>
			useInteractionInput({
				candidates: createCandidates(),
				sendDungeonMachineEvent,
			}),
		);

		act(() => {
			result.current.handleInteract();
			result.current.handleInteract();
		});

		expect(sendDungeonMachineEvent).toHaveBeenCalledTimes(1);

		act(() => {
			vi.advanceTimersByTime(INTERACTION_COOLDOWN_MS.INTERACT);
			result.current.handleInteract();
		});

		expect(sendDungeonMachineEvent).toHaveBeenCalledTimes(2);
	});

	it("blocks repeat attack events during cooldown", () => {
		const sendDungeonMachineEvent = vi.fn();
		const { result } = renderHook(() =>
			useInteractionInput({
				candidates: createCandidates(),
				sendDungeonMachineEvent,
			}),
		);

		act(() => {
			result.current.handleAttack();
			result.current.handleAttack();
		});

		expect(sendDungeonMachineEvent).toHaveBeenCalledTimes(1);
		expect(sendDungeonMachineEvent).toHaveBeenCalledWith({
			type: DUNGEON_EVENTS.ENEMY_DIED,
		});

		act(() => {
			vi.advanceTimersByTime(INTERACTION_COOLDOWN_MS.ATTACK);
			result.current.handleAttack();
		});

		expect(sendDungeonMachineEvent).toHaveBeenCalledTimes(2);
	});

	it("handles keyboard shortcuts when enabled", () => {
		const sendDungeonMachineEvent = vi.fn();
		renderHook(() =>
			useInteractionInput({
				candidates: createCandidates(),
				sendDungeonMachineEvent,
			}),
		);

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", { key: INTERACTION_KEYS.INTERACT }),
			);
		});

		expect(sendDungeonMachineEvent).toHaveBeenCalledWith({
			type: DUNGEON_EVENTS.PICK_UP_KEY,
		});
	});

	it("does not handle keyboard shortcuts when bindings are disabled", () => {
		const sendDungeonMachineEvent = vi.fn();
		renderHook(() =>
			useInteractionInput({
				candidates: createCandidates(),
				sendDungeonMachineEvent,
				enableKeyboardBindings: false,
			}),
		);

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", { key: INTERACTION_KEYS.INTERACT }),
			);
		});

		expect(sendDungeonMachineEvent).not.toHaveBeenCalled();
	});
});
