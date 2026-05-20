// @vitest-environment happy-dom

import type {
	IntersectionEnterPayload,
	IntersectionExitPayload,
} from "@react-three/rapier";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PHYSICS_COLLIDER_NAMES } from "@/shared/config";

import { PLAYER_EVENT_TYPES, PLAYER_GROUNDING_CONFIG } from "../config";
import { usePlayerGroundingRuntime } from "./usePlayerGroundingRuntime";

type GroundIntersectionPayload = IntersectionEnterPayload &
	IntersectionExitPayload;

const createGroundIntersectionPayload = (
	id: number,
	name: string,
): GroundIntersectionPayload =>
	({
		other: {
			collider: { handle: id },
			colliderObject: {
				name,
			},
		},
	}) as GroundIntersectionPayload;

describe("usePlayerGroundingRuntime", () => {
	it("tracks qualified floor contacts without emitting redundant initial LANDED, then dispatches LEFT_GROUND and LANDED from real transitions", () => {
		const sendPlayerMachineEvent = vi.fn();

		const { result } = renderHook(() =>
			usePlayerGroundingRuntime({ sendPlayerMachineEvent }),
		);

		expect(result.current.isGrounded).toBe(true);
		expect(result.current.groundSensorColliderProps).toMatchObject({
			args: PLAYER_GROUNDING_CONFIG.SENSOR_HALF_EXTENTS,
			mass: PLAYER_GROUNDING_CONFIG.SENSOR_MASS,
			position: [0, PLAYER_GROUNDING_CONFIG.SENSOR_POSITION_Y, 0],
			sensor: true,
		});

		const wallPayload = createGroundIntersectionPayload(1, "wall");
		const roomFloorPayload = createGroundIntersectionPayload(
			2,
			PHYSICS_COLLIDER_NAMES.WALKABLE_GROUND,
		);
		const corridorFloorPayload = createGroundIntersectionPayload(
			3,
			PHYSICS_COLLIDER_NAMES.WALKABLE_GROUND,
		);

		act(() => {
			result.current.groundSensorColliderProps.onIntersectionEnter(wallPayload);
		});

		expect(sendPlayerMachineEvent).not.toHaveBeenCalled();
		expect(result.current.isGrounded).toBe(true);

		act(() => {
			result.current.groundSensorColliderProps.onIntersectionEnter(
				roomFloorPayload,
			);
		});

		expect(sendPlayerMachineEvent).not.toHaveBeenCalled();
		expect(result.current.isGrounded).toBe(true);

		act(() => {
			result.current.groundSensorColliderProps.onIntersectionEnter(
				corridorFloorPayload,
			);
		});

		expect(sendPlayerMachineEvent).not.toHaveBeenCalled();
		expect(result.current.isGrounded).toBe(true);

		act(() => {
			result.current.groundSensorColliderProps.onIntersectionExit(
				roomFloorPayload,
			);
		});

		expect(sendPlayerMachineEvent).not.toHaveBeenCalled();
		expect(result.current.isGrounded).toBe(true);

		act(() => {
			result.current.groundSensorColliderProps.onIntersectionExit(
				corridorFloorPayload,
			);
		});

		expect(sendPlayerMachineEvent).toHaveBeenCalledTimes(1);
		expect(sendPlayerMachineEvent).toHaveBeenLastCalledWith({
			type: PLAYER_EVENT_TYPES.LEFT_GROUND,
		});
		expect(result.current.isGrounded).toBe(false);
	});

	it("does not duplicate transition events for repeated callbacks from the same qualified floor collider", () => {
		const sendPlayerMachineEvent = vi.fn();

		const { result } = renderHook(() =>
			usePlayerGroundingRuntime({ sendPlayerMachineEvent }),
		);

		const floorPayload = createGroundIntersectionPayload(
			12,
			PHYSICS_COLLIDER_NAMES.WALKABLE_GROUND,
		);

		act(() => {
			result.current.groundSensorColliderProps.onIntersectionEnter(
				floorPayload,
			);
			result.current.groundSensorColliderProps.onIntersectionEnter(
				floorPayload,
			);
		});

		expect(sendPlayerMachineEvent).not.toHaveBeenCalled();

		act(() => {
			result.current.groundSensorColliderProps.onIntersectionExit(floorPayload);
		});

		expect(sendPlayerMachineEvent).toHaveBeenCalledTimes(1);
		expect(sendPlayerMachineEvent).toHaveBeenCalledWith({
			type: PLAYER_EVENT_TYPES.LEFT_GROUND,
		});
		expect(result.current.isGrounded).toBe(false);
	});
});
