import { describe, expect, it } from "vitest";

import { INPUT_EVENT_TYPES } from "../config";
import { resolveKeyboardInputEvent } from "./resolveKeyboardInputEvent";

describe("resolveKeyboardInputEvent", () => {
	it("returns RUN_HELD_CHANGED true for ShiftLeft down", () => {
		const result = resolveKeyboardInputEvent({
			code: "ShiftLeft",
			phase: INPUT_EVENT_TYPES.KEY_DOWN,
		});

		expect(result).toEqual({
			type: INPUT_EVENT_TYPES.RUN_HELD_CHANGED,
			isHeld: true,
		});
	});

	it("returns RUN_HELD_CHANGED false for ShiftLeft up", () => {
		const result = resolveKeyboardInputEvent({
			code: "ShiftLeft",
			phase: INPUT_EVENT_TYPES.KEY_UP,
		});

		expect(result).toEqual({
			type: INPUT_EVENT_TYPES.RUN_HELD_CHANGED,
			isHeld: false,
		});
	});

	it("returns RUN_HELD_CHANGED true for ShiftRight down", () => {
		const result = resolveKeyboardInputEvent({
			code: "ShiftRight",
			phase: INPUT_EVENT_TYPES.KEY_DOWN,
		});

		expect(result).toEqual({
			type: INPUT_EVENT_TYPES.RUN_HELD_CHANGED,
			isHeld: true,
		});
	});

	it("returns JUMP_PRESSED for Space down", () => {
		const result = resolveKeyboardInputEvent({
			code: "Space",
			phase: INPUT_EVENT_TYPES.KEY_DOWN,
		});

		expect(result).toEqual({ type: INPUT_EVENT_TYPES.JUMP_PRESSED });
	});

	it("returns INTERACT_PRESSED for KeyE down", () => {
		const result = resolveKeyboardInputEvent({
			code: "KeyE",
			phase: INPUT_EVENT_TYPES.KEY_DOWN,
		});

		expect(result).toEqual({ type: INPUT_EVENT_TYPES.INTERACT_PRESSED });
	});

	it("returns ATTACK_PRESSED for KeyF down", () => {
		const result = resolveKeyboardInputEvent({
			code: "KeyF",
			phase: INPUT_EVENT_TYPES.KEY_DOWN,
		});

		expect(result).toEqual({ type: INPUT_EVENT_TYPES.ATTACK_PRESSED });
	});

	it("returns undefined for irrelevant key", () => {
		const result = resolveKeyboardInputEvent({
			code: "KeyX",
			phase: INPUT_EVENT_TYPES.KEY_DOWN,
		});

		expect(result).toBeUndefined();
	});

	it("returns undefined for irrelevant key up", () => {
		const result = resolveKeyboardInputEvent({
			code: "KeyX",
			phase: INPUT_EVENT_TYPES.KEY_UP,
		});

		expect(result).toBeUndefined();
	});
});
