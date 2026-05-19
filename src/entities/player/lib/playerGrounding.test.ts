import { describe, expect, it } from "vitest";

import { PHYSICS_COLLIDER_NAMES } from "@/shared/config";

import { PLAYER_EVENT_TYPES } from "../config";
import {
	addPlayerGroundContactHandle,
	type ResolvePlayerGroundContactKeyInput,
	removePlayerGroundContactHandle,
	resolvePlayerGroundContactKey,
	resolvePlayerGroundingMachineEvent,
} from "./playerGrounding";

const createGroundContactInput = (
	handle: number,
	name: string,
): ResolvePlayerGroundContactKeyInput =>
	({
		other: {
			collider: {
				handle,
			} as ResolvePlayerGroundContactKeyInput["other"]["collider"],
			colliderObject: {
				name,
			} as ResolvePlayerGroundContactKeyInput["other"]["colliderObject"],
		},
	}) as ResolvePlayerGroundContactKeyInput;

describe("playerGrounding", () => {
	it("returns the collider handle only for walkable ground colliders", () => {
		expect(
			resolvePlayerGroundContactKey(
				createGroundContactInput(17, PHYSICS_COLLIDER_NAMES.WALKABLE_GROUND),
			),
		).toBe(17);
	});

	it("ignores non-walkable or missing ground contacts", () => {
		expect(
			resolvePlayerGroundContactKey(createGroundContactInput(17, "wall")),
		).toBeNull();

		expect(
			resolvePlayerGroundContactKey({
				other: {
					collider: { handle: 17 },
				},
			} as ResolvePlayerGroundContactKeyInput),
		).toBeNull();
	});

	it("adds and removes ground contact handles immutably and idempotently", () => {
		const initialHandles = new Set<number>();

		const withFirstHandle = addPlayerGroundContactHandle({
			currentGroundContactHandles: initialHandles,
			groundContactHandle: 12,
		});
		const withDuplicateHandle = addPlayerGroundContactHandle({
			currentGroundContactHandles: withFirstHandle,
			groundContactHandle: 12,
		});
		const withoutFirstHandle = removePlayerGroundContactHandle({
			currentGroundContactHandles: withDuplicateHandle,
			groundContactHandle: 12,
		});

		expect(initialHandles.size).toBe(0);
		expect(withFirstHandle).not.toBe(initialHandles);
		expect(withFirstHandle.has(12)).toBe(true);
		expect(withDuplicateHandle.size).toBe(1);
		expect(withoutFirstHandle.size).toBe(0);
	});

	it("resolves only meaningful grounding transitions into player machine events", () => {
		expect(
			resolvePlayerGroundingMachineEvent({
				previousIsGrounded: false,
				nextIsGrounded: true,
			}),
		).toEqual({
			type: PLAYER_EVENT_TYPES.LANDED,
		});

		expect(
			resolvePlayerGroundingMachineEvent({
				previousIsGrounded: true,
				nextIsGrounded: false,
			}),
		).toEqual({
			type: PLAYER_EVENT_TYPES.LEFT_GROUND,
		});

		expect(
			resolvePlayerGroundingMachineEvent({
				previousIsGrounded: true,
				nextIsGrounded: true,
			}),
		).toBeNull();

		expect(
			resolvePlayerGroundingMachineEvent({
				previousIsGrounded: false,
				nextIsGrounded: false,
			}),
		).toBeNull();
	});
});
