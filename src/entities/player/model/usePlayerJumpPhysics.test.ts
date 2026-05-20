// @vitest-environment happy-dom

import type { RapierRigidBody } from "@react-three/rapier";
import { renderHook } from "@testing-library/react";
import type { RefObject } from "react";
import { describe, expect, it, vi } from "vitest";

import { PLAYER_JUMP_CONFIG } from "../config";
import { usePlayerJumpPhysics } from "./usePlayerJumpPhysics";

type FakeRigidBody = {
	applyImpulse: ReturnType<typeof vi.fn>;
};

const createRigidBodyRef = (rigidBody: FakeRigidBody) =>
	({
		current: rigidBody as unknown as RapierRigidBody,
	}) as RefObject<RapierRigidBody | null>;

describe("usePlayerJumpPhysics", () => {
	it("applies the jump impulse once and resets after the request clears", () => {
		const rigidBody = {
			applyImpulse: vi.fn(),
		};

		const { rerender } = renderHook(
			({
				isGrounded,
				wantsJumpImpulse,
			}: {
				isGrounded: boolean;
				wantsJumpImpulse: boolean;
			}) =>
				usePlayerJumpPhysics({
					rigidBodyRef: createRigidBodyRef(rigidBody),
					isGrounded,
					wantsJumpImpulse,
				}),
			{
				initialProps: {
					isGrounded: true,
					wantsJumpImpulse: false,
				},
			},
		);

		rerender({ isGrounded: true, wantsJumpImpulse: true });

		expect(rigidBody.applyImpulse).toHaveBeenCalledWith(
			{
				x: 0,
				y: PLAYER_JUMP_CONFIG.IMPULSE,
				z: 0,
			},
			true,
		);
		expect(rigidBody.applyImpulse).toHaveBeenCalledTimes(1);

		rerender({ isGrounded: true, wantsJumpImpulse: true });

		expect(rigidBody.applyImpulse).toHaveBeenCalledTimes(1);

		rerender({ isGrounded: false, wantsJumpImpulse: true });

		expect(rigidBody.applyImpulse).toHaveBeenCalledTimes(1);

		rerender({ isGrounded: true, wantsJumpImpulse: false });

		expect(rigidBody.applyImpulse).toHaveBeenCalledTimes(1);

		rerender({ isGrounded: true, wantsJumpImpulse: true });

		expect(rigidBody.applyImpulse).toHaveBeenCalledTimes(2);
	});
});
