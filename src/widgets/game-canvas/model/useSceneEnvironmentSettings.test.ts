// @vitest-environment happy-dom

import { renderHook } from "@testing-library/react";
import { afterAll, describe, expect, it, vi } from "vitest";

import { ROOM_IDS, ROOM_LABELS } from "@/entities/dungeon";
import { PLAYER_ENTITY_CONFIG } from "@/entities/player";

import { useSceneEnvironmentSettings } from "./useSceneEnvironmentSettings";

const consoleWarnSpy = vi.hoisted(() => {
	return vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
	consoleWarnSpy.mockRestore();
});

describe("useSceneEnvironmentSettings", () => {
	it("returns machine-derived room mesh settings for all floor-one rooms", () => {
		const { result } = renderHook(() => useSceneEnvironmentSettings());

		expect(result.current.roomMeshSettings.map((room) => room.roomId)).toEqual([
			ROOM_IDS.ENTRANCE,
			ROOM_IDS.LIBRARY,
			ROOM_IDS.GUARD_ROOM,
			ROOM_IDS.TREASURY,
			ROOM_IDS.EXIT,
		]);
		expect(result.current.roomMeshSettings).toHaveLength(5);
		expect(result.current.roomMeshSettings[0].labelSettings.text).toBe(
			ROOM_LABELS[ROOM_IDS.ENTRANCE],
		);
		expect(result.current.roomMeshSettings[4].labelSettings.text).toBe(
			ROOM_LABELS[ROOM_IDS.EXIT],
		);
		expect(
			new Set(
				result.current.roomMeshSettings.map((room) => room.position.join(":")),
			).size,
		).toBe(5);
	});

	it("returns corridor mesh settings for adjacent generated transitions", () => {
		const { result } = renderHook(() => useSceneEnvironmentSettings());

		expect(
			result.current.corridorMeshSettings.map((corridor) => corridor.id),
		).toEqual([
			`${ROOM_IDS.ENTRANCE}:${ROOM_IDS.LIBRARY}`,
			`${ROOM_IDS.LIBRARY}:${ROOM_IDS.GUARD_ROOM}`,
			`${ROOM_IDS.GUARD_ROOM}:${ROOM_IDS.TREASURY}`,
			`${ROOM_IDS.TREASURY}:${ROOM_IDS.EXIT}`,
		]);
		expect(result.current.corridorMeshSettings).toHaveLength(4);
		expect(result.current.corridorMeshSettings[0].position).toEqual([
			0, -0.1, -30,
		]);
	});

	it("positions the player mesh at the generated entrance room", () => {
		const { result } = renderHook(() => useSceneEnvironmentSettings());

		expect(result.current.playerMeshSettings).toMatchObject({
			auraColor: "#00d7ff",
			auraEmissiveIntensity: 1.25,
		});
		expect(result.current.playerMeshSettings.position).toEqual([
			0,
			PLAYER_ENTITY_CONFIG.TRANSFORM.SPAWN_HEIGHT_OFFSET,
			-40,
		]);
	});
});
