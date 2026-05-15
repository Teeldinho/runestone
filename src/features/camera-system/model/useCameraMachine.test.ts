// @vitest-environment happy-dom

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CAMERA_CONFIG, PLAYER_EYE_HEIGHT } from "@/shared/config";
import {
	CAMERA_DEFAULT_MODE,
	CAMERA_EVENTS,
	CAMERA_HOTKEYS,
	CAMERA_MODES,
} from "../config";
import { useCameraMachine } from "./useCameraMachine";

describe("useCameraMachine", () => {
	it("starts in the default camera mode with a preset snapshot", () => {
		const { result } = renderHook(() => useCameraMachine());

		expect(result.current.mode).toBe(CAMERA_DEFAULT_MODE);
		expect(result.current.cameraStateSnapshot).toEqual({
			distance: 6,
			fov: CAMERA_CONFIG.THIRD_PERSON.FOV,
			mode: CAMERA_DEFAULT_MODE,
			pitch: 0,
			position: CAMERA_CONFIG.THIRD_PERSON.OFFSET,
			target: [0, PLAYER_EYE_HEIGHT, 0],
			yaw: 0,
			zoom: 1,
		});
	});

	it("switches mode from explicit camera events", () => {
		const { result } = renderHook(() => useCameraMachine());

		act(() => {
			result.current.handleCameraModeSwitch({
				type: CAMERA_EVENTS.SWITCH_TO_TOP_DOWN,
			});
		});

		expect(result.current.mode).toBe(CAMERA_MODES.TOP_DOWN);
		expect(result.current.cameraStateSnapshot.position).toEqual([
			0,
			CAMERA_CONFIG.TOP_DOWN.HEIGHT,
			CAMERA_CONFIG.TOP_DOWN.DISTANCE,
		]);
	});

	it("handles keyboard hotkeys for mode switching", () => {
		const { result } = renderHook(() => useCameraMachine());

		act(() => {
			window.dispatchEvent(
				new KeyboardEvent("keydown", {
					key: CAMERA_HOTKEYS.FIRST_PERSON,
				}),
			);
		});

		expect(result.current.mode).toBe(CAMERA_MODES.FIRST_PERSON);
		expect(result.current.cameraStateSnapshot.target).toEqual([
			0,
			PLAYER_EYE_HEIGHT,
			0,
		]);
	});

	it("updates the snapshot by mode rather than by live camera telemetry", () => {
		const { result } = renderHook(() => useCameraMachine());

		act(() => {
			result.current.handleCameraModeSwitch({
				type: CAMERA_EVENTS.SWITCH_TO_FREE_ORBITAL,
			});
		});

		expect(result.current.cameraStateSnapshot.position).toEqual(
			CAMERA_CONFIG.FREE_ORBITAL.INITIAL_POSITION,
		);
		expect(result.current.cameraStateSnapshot.zoom).toBe(1);
	});
});
