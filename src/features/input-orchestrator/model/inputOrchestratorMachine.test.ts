import { describe, expect, it } from "vitest";
import { createActor, fromTransition } from "xstate";

import { PLAYER_EVENT_TYPES } from "@/entities/player";
import { INPUT_EVENT_TYPES } from "@/features/input-orchestrator";
import { CAMERA_EVENT_TYPES } from "@/shared/config";

import { inputOrchestratorMachine } from "./inputOrchestratorMachine";

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

describe("inputOrchestratorMachine", () => {
	it("starts with the run toggle off", () => {
		const actor = createActor(inputOrchestratorMachine, {
			input: {
				playerRef: createEventRecorderActor(),
				cameraRef: createEventRecorderActor(),
				interactionRef: createEventRecorderActor(),
			},
		}).start();

		expect(
			actor.getSnapshot().matches({
				ready: {
					runToggleRegion: "runToggleOff",
				},
			}),
		).toBe(true);
	});

	it("toggles run state on and off", () => {
		const actor = createActor(inputOrchestratorMachine, {
			input: {
				playerRef: createEventRecorderActor(),
				cameraRef: createEventRecorderActor(),
				interactionRef: createEventRecorderActor(),
			},
		}).start();

		actor.send({ type: INPUT_EVENT_TYPES.RUN_TOGGLED });

		expect(
			actor.getSnapshot().matches({
				ready: {
					runToggleRegion: "runToggleOn",
				},
			}),
		).toBe(true);

		actor.send({ type: INPUT_EVENT_TYPES.RUN_TOGGLED });

		expect(
			actor.getSnapshot().matches({
				ready: {
					runToggleRegion: "runToggleOff",
				},
			}),
		).toBe(true);
	});

	it("sends player move with wantsRun true when run toggles while moving", () => {
		const playerRef = createEventRecorderActor();
		const cameraRef = createEventRecorderActor();
		const interactionRef = createEventRecorderActor();

		const actor = createActor(inputOrchestratorMachine, {
			input: {
				playerRef,
				cameraRef,
				interactionRef,
			},
		}).start();

		actor.send({
			type: INPUT_EVENT_TYPES.MOVE_CHANGED,
			vector: { x: 0, y: 1 },
			magnitude: 0.4,
			wantsRun: false,
		});
		actor.send({ type: INPUT_EVENT_TYPES.RUN_TOGGLED });

		expect(playerRef.getSnapshot().context).toEqual([
			{
				type: PLAYER_EVENT_TYPES.MOVE_CHANGED,
				vector: { x: 0, y: 1 },
				wantsRun: false,
			},
			{
				type: PLAYER_EVENT_TYPES.MOVE_CHANGED,
				vector: { x: 0, y: 1 },
				wantsRun: true,
			},
		]);
		expect(actor.getSnapshot().context.isMobileRunToggled).toBe(true);
	});

	it("only toggles mobile run when run is pressed without movement", () => {
		const playerRef = createEventRecorderActor();
		const cameraRef = createEventRecorderActor();
		const interactionRef = createEventRecorderActor();

		const actor = createActor(inputOrchestratorMachine, {
			input: {
				playerRef,
				cameraRef,
				interactionRef,
			},
		}).start();

		actor.send({ type: INPUT_EVENT_TYPES.RUN_TOGGLED });

		expect(playerRef.getSnapshot().context).toEqual([]);
		expect(actor.getSnapshot().context.isMobileRunToggled).toBe(true);
	});

	it("sends player move with wantsRun false when run toggles off while moving", () => {
		const playerRef = createEventRecorderActor();
		const cameraRef = createEventRecorderActor();
		const interactionRef = createEventRecorderActor();

		const actor = createActor(inputOrchestratorMachine, {
			input: {
				playerRef,
				cameraRef,
				interactionRef,
			},
		}).start();

		actor.send({
			type: INPUT_EVENT_TYPES.MOVE_CHANGED,
			vector: { x: 0, y: 1 },
			magnitude: 0.4,
			wantsRun: false,
		});
		actor.send({ type: INPUT_EVENT_TYPES.RUN_TOGGLED });
		actor.send({ type: INPUT_EVENT_TYPES.RUN_TOGGLED });

		expect(playerRef.getSnapshot().context).toEqual([
			{
				type: PLAYER_EVENT_TYPES.MOVE_CHANGED,
				vector: { x: 0, y: 1 },
				wantsRun: false,
			},
			{
				type: PLAYER_EVENT_TYPES.MOVE_CHANGED,
				vector: { x: 0, y: 1 },
				wantsRun: true,
			},
			{
				type: PLAYER_EVENT_TYPES.MOVE_CHANGED,
				vector: { x: 0, y: 1 },
				wantsRun: false,
			},
		]);
		expect(actor.getSnapshot().context.isMobileRunToggled).toBe(false);
	});

	it("forwards look events with camera-system event types", () => {
		const playerRef = createEventRecorderActor();
		const cameraRef = createEventRecorderActor();
		const interactionRef = createEventRecorderActor();

		const actor = createActor(inputOrchestratorMachine, {
			input: {
				playerRef,
				cameraRef,
				interactionRef,
			},
		}).start();

		actor.send({
			type: INPUT_EVENT_TYPES.LOOK_CHANGED,
			delta: { x: 2, y: -3 },
		});
		actor.send({ type: INPUT_EVENT_TYPES.LOOK_STOPPED });

		expect(cameraRef.getSnapshot().context).toEqual([
			{
				type: CAMERA_EVENT_TYPES.LOOK_CHANGED,
				delta: { x: 2, y: -3 },
			},
			{
				type: CAMERA_EVENT_TYPES.LOOK_STOPPED,
			},
		]);
	});
});
