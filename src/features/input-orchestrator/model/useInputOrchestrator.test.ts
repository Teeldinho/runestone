// @vitest-environment happy-dom

import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createActor, fromTransition } from "xstate";

import { INPUT_EVENT_TYPES, INPUT_STATE_KEYS } from "../config";

import { useInputOrchestrator } from "./useInputOrchestrator";

type RecordedEvent = {
	readonly type: string;
	readonly [key: string]: unknown;
};

const createEventRecorderActor = () => {
	const logic = fromTransition(
		(state: RecordedEvent[], event: RecordedEvent) => [...state, event],
		[] as RecordedEvent[],
	);

	return createActor(logic).start();
};

describe("useInputOrchestrator", () => {
	it("exposes the initial input state value", () => {
		const { result } = renderHook(() =>
			useInputOrchestrator({
				playerRef: createEventRecorderActor(),
				interactionRef: createEventRecorderActor(),
			}),
		);

		expect(result.current.inputStateValue).toEqual({
			[INPUT_STATE_KEYS.READY]: {
				[INPUT_STATE_KEYS.MOVEMENT_REGION]: INPUT_STATE_KEYS.MOVEMENT_IDLE,
				[INPUT_STATE_KEYS.RUN_TOGGLE_REGION]: INPUT_STATE_KEYS.RUN_TOGGLE_OFF,
			},
		});
		expect(result.current.isRunToggled).toBe(false);
	});

	it("updates the exposed input state when the run toggle changes", async () => {
		const { result } = renderHook(() =>
			useInputOrchestrator({
				playerRef: createEventRecorderActor(),
				interactionRef: createEventRecorderActor(),
			}),
		);

		act(() => {
			result.current.sendInput({ type: INPUT_EVENT_TYPES.RUN_TOGGLED });
		});

		await waitFor(() => {
			expect(result.current.inputStateValue).toEqual({
				[INPUT_STATE_KEYS.READY]: {
					[INPUT_STATE_KEYS.MOVEMENT_REGION]: INPUT_STATE_KEYS.MOVEMENT_IDLE,
					[INPUT_STATE_KEYS.RUN_TOGGLE_REGION]: INPUT_STATE_KEYS.RUN_TOGGLE_ON,
				},
			});
		});

		expect(result.current.isRunToggled).toBe(true);
	});
});
