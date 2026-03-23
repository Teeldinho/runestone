import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createActor } from "xstate";

import { ENEMY_EVENTS, ENEMY_MACHINE_STATES } from "../config";
import { createEnemyBehaviorMachine } from "./enemyBehaviorMachine";

const ENEMY_ID = "enemy-1";
const ROOM_ID = "guardRoom";
const ENEMY_POSITION: [number, number, number] = [10, 0, 10];

const createTestActor = () =>
	createActor(createEnemyBehaviorMachine(), {
		input: { id: ENEMY_ID, roomId: ROOM_ID, position: ENEMY_POSITION },
	}).start();

describe("createEnemyBehaviorMachine", () => {
	it("starts in patrol state", () => {
		const actor = createTestActor();
		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.PATROL);
	});

	it("initialises context from input", () => {
		const actor = createTestActor();
		const { context } = actor.getSnapshot();

		expect(context.id).toBe(ENEMY_ID);
		expect(context.roomId).toBe(ROOM_ID);
		expect(context.position).toEqual(ENEMY_POSITION);
	});

	it("transitions patrol → detect when player enters detection range", () => {
		const actor = createTestActor();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 13],
		});

		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.DETECT);
	});

	it("stays in patrol when player is out of detection range", () => {
		const actor = createTestActor();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [0, 0, 0],
		});

		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.PATROL);
	});

	it("transitions detect → patrol when player leaves detection range", () => {
		const actor = createTestActor();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 13],
		});
		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.DETECT);

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [0, 0, 0],
		});
		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.PATROL);
	});

	describe("detect → chase after delay", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it("transitions detect → chase after 500ms when player stays in detection range", () => {
			const actor = createTestActor();

			actor.send({
				type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
				position: [10, 0, 13],
			});
			expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.DETECT);

			vi.advanceTimersByTime(600);

			expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.CHASE);
		});

		it("transitions detect → patrol after delay when player has left range", () => {
			const actor = createTestActor();

			actor.send({
				type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
				position: [10, 0, 13],
			});

			actor.send({
				type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
				position: [0, 0, 0],
			});
			expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.PATROL);

			vi.advanceTimersByTime(600);
			expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.PATROL);
		});
	});

	it("transitions chase → attack when player enters attack range", () => {
		const actor = createTestActor();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 13],
		});

		vi.useFakeTimers();
		vi.advanceTimersByTime(600);
		vi.useRealTimers();

		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.CHASE);

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 11],
		});

		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.ATTACK);
	});

	it("transitions chase → patrol when player leaves detection range", () => {
		const actor = createTestActor();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 13],
		});

		vi.useFakeTimers();
		vi.advanceTimersByTime(600);
		vi.useRealTimers();

		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.CHASE);

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [0, 0, 0],
		});

		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.PATROL);
	});

	it("transitions attack → dead on lethal damage", () => {
		const actor = createTestActor();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 13],
		});

		vi.useFakeTimers();
		vi.advanceTimersByTime(600);
		vi.useRealTimers();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 11],
		});

		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.ATTACK);

		actor.send({ type: ENEMY_EVENTS.TAKE_DAMAGE, amount: 100 });

		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.DEAD);
	});

	it("dead is a final state", () => {
		const actor = createTestActor();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 13],
		});

		vi.useFakeTimers();
		vi.advanceTimersByTime(600);
		vi.useRealTimers();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 11],
		});
		actor.send({ type: ENEMY_EVENTS.TAKE_DAMAGE, amount: 100 });

		const snapshot = actor.getSnapshot();
		expect(snapshot.value).toBe(ENEMY_MACHINE_STATES.DEAD);
		expect(snapshot.status).toBe("done");
	});

	it("stores updated hp in context after non-lethal damage in attack state", () => {
		const actor = createTestActor();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 13],
		});

		vi.useFakeTimers();
		vi.advanceTimersByTime(600);
		vi.useRealTimers();

		actor.send({
			type: ENEMY_EVENTS.UPDATE_PLAYER_POSITION,
			position: [10, 0, 11],
		});

		actor.send({ type: ENEMY_EVENTS.TAKE_DAMAGE, amount: 20 });

		expect(actor.getSnapshot().value).toBe(ENEMY_MACHINE_STATES.ATTACK);
		expect(actor.getSnapshot().context.hp).toBe(25);
	});
});
