import { describe, expect, it } from "vitest";
import { createActor } from "xstate";

import {
	PLAYER_EVENTS,
	PLAYER_MACHINE_DEFAULTS,
	PLAYER_STATES,
} from "../config";
import { createPlayerMachine } from "./playerMachine";

describe("createPlayerMachine", () => {
	it("starts in idle movement and alive health state", () => {
		const actor = createActor(createPlayerMachine()).start();

		expect(actor.getSnapshot().value).toEqual({
			[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.IDLE,
			[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.ALIVE,
		});
	});

	it("has correct initial context", () => {
		const actor = createActor(createPlayerMachine()).start();
		const { context } = actor.getSnapshot();

		expect(context.position).toEqual(PLAYER_MACHINE_DEFAULTS.POSITION);
		expect(context.velocity).toEqual(PLAYER_MACHINE_DEFAULTS.VELOCITY);
		expect(context.stats.hp).toBe(PLAYER_MACHINE_DEFAULTS.STATS.HP);
		expect(context.stats.maxHp).toBe(PLAYER_MACHINE_DEFAULTS.STATS.MAX_HP);
		expect(context.stats.score).toBe(PLAYER_MACHINE_DEFAULTS.STATS.SCORE);
		expect(context.stats.keyCount).toBe(
			PLAYER_MACHINE_DEFAULTS.STATS.KEY_COUNT,
		);
		expect(context.stats.chainMultiplier).toBe(
			PLAYER_MACHINE_DEFAULTS.STATS.CHAIN_MULTIPLIER,
		);
	});

	it("transitions to walking on MOVE event", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.MOVE, velocity: [1, 0, 0] });

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.WALKING,
		});
	});

	it("updates velocity context on MOVE event", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.MOVE, velocity: [1, 0, 0] });

		expect(actor.getSnapshot().context.velocity).toEqual([1, 0, 0]);
	});

	it("transitions back to idle on STOP event", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.MOVE, velocity: [1, 0, 0] });
		actor.send({ type: PLAYER_EVENTS.STOP });

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.IDLE,
		});
	});

	it("zeros velocity on STOP event", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.MOVE, velocity: [1, 0, 0] });
		actor.send({ type: PLAYER_EVENTS.STOP });

		expect(actor.getSnapshot().context.velocity).toEqual([0, 0, 0]);
	});

	it("transitions to damaged on TAKE_DAMAGE event", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.TAKE_DAMAGE, amount: 10 });

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.DAMAGED,
		});
	});

	it("reduces hp on TAKE_DAMAGE event", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.TAKE_DAMAGE, amount: 10 });

		expect(actor.getSnapshot().context.stats.hp).toBe(
			PLAYER_MACHINE_DEFAULTS.STATS.HP - 10,
		);
	});

	it("transitions to dead when damage equals remaining hp", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: PLAYER_MACHINE_DEFAULTS.STATS.HP,
		});

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.DEAD,
		});
	});

	it("clamps hp to zero on lethal damage", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: PLAYER_MACHINE_DEFAULTS.STATS.HP + 50,
		});

		expect(actor.getSnapshot().context.stats.hp).toBe(0);
		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.DEAD,
		});
	});

	it("recovers from damaged to alive on HEAL event", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.TAKE_DAMAGE, amount: 10 });
		actor.send({ type: PLAYER_EVENTS.HEAL, amount: 10 });

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.ALIVE,
		});
	});

	it("restores hp on HEAL but does not exceed maxHp", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.TAKE_DAMAGE, amount: 10 });
		actor.send({
			type: PLAYER_EVENTS.HEAL,
			amount: PLAYER_MACHINE_DEFAULTS.STATS.MAX_HP + 999,
		});

		expect(actor.getSnapshot().context.stats.hp).toBe(
			PLAYER_MACHINE_DEFAULTS.STATS.MAX_HP,
		);
	});

	it("transitions to dead on DIE event from alive", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.DIE });

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.DEAD,
		});
	});

	it("transitions to dead on DIE event from damaged", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.TAKE_DAMAGE, amount: 10 });
		actor.send({ type: PLAYER_EVENTS.DIE });

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.DEAD,
		});
	});

	it("ignores MOVE when player is dead", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: PLAYER_MACHINE_DEFAULTS.STATS.HP,
		});
		actor.send({ type: PLAYER_EVENTS.MOVE, velocity: [1, 0, 0] });

		expect(actor.getSnapshot().context.velocity).toEqual([0, 0, 0]);
		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.IDLE,
		});
	});

	it("transitions from dead to alive on RESTART event", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: PLAYER_MACHINE_DEFAULTS.STATS.HP,
		});
		actor.send({ type: PLAYER_EVENTS.RESTART });

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.ALIVE,
		});
	});

	it("restores hp to maxHp on RESTART", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: PLAYER_MACHINE_DEFAULTS.STATS.HP,
		});
		actor.send({ type: PLAYER_EVENTS.RESTART });

		expect(actor.getSnapshot().context.stats.hp).toBe(
			PLAYER_MACHINE_DEFAULTS.STATS.MAX_HP,
		);
	});

	it("allows movement again after RESTART", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: PLAYER_MACHINE_DEFAULTS.STATS.HP,
		});
		actor.send({ type: PLAYER_EVENTS.RESTART });
		actor.send({ type: PLAYER_EVENTS.MOVE, velocity: [1, 0, 0] });

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.MOVEMENT]: PLAYER_STATES.MOVEMENT.WALKING,
		});
		expect(actor.getSnapshot().context.velocity).toEqual([1, 0, 0]);
	});

	it("can take further damage while already damaged", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({ type: PLAYER_EVENTS.TAKE_DAMAGE, amount: 10 });
		actor.send({ type: PLAYER_EVENTS.TAKE_DAMAGE, amount: 10 });

		expect(actor.getSnapshot().context.stats.hp).toBe(
			PLAYER_MACHINE_DEFAULTS.STATS.HP - 20,
		);
	});

	it("transitions to dead from damaged when cumulative damage is lethal", () => {
		const actor = createActor(createPlayerMachine()).start();

		actor.send({
			type: PLAYER_EVENTS.TAKE_DAMAGE,
			amount: PLAYER_MACHINE_DEFAULTS.STATS.HP - 1,
		});
		actor.send({ type: PLAYER_EVENTS.TAKE_DAMAGE, amount: 1 });

		expect(actor.getSnapshot().value).toMatchObject({
			[PLAYER_STATES.REGIONS.HEALTH]: PLAYER_STATES.HEALTH.DEAD,
		});
		expect(actor.getSnapshot().context.stats.hp).toBe(0);
	});
});
