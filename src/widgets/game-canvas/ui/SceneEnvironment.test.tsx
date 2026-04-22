// @vitest-environment happy-dom

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { CanvasEnvironmentSettings } from "../model";
import { SceneEnvironment } from "./SceneEnvironment";

const mockEnemyMesh = vi.fn((_props: unknown) => null);

vi.mock("@/entities/corridor", () => ({
	CorridorMesh: () => null,
}));

vi.mock("@/entities/enemy", () => ({
	EnemyMesh: (props: unknown) => mockEnemyMesh(props),
}));

vi.mock("@/entities/player", () => ({
	PlayerMesh: () => null,
}));

vi.mock("@/entities/room", () => ({
	RoomLabel: () => null,
	RoomMesh: () => null,
}));

vi.mock("../model", () => ({
	useSceneEnvironmentSettings: () => ({
		corridorMeshSettings: [],
		enemyMeshSettings: [
			{
				id: "guard-room-enemy-1",
				roomId: "guard-room",
				position: [0, 1, 0],
				patrolCenter: [0, 1, 0],
			},
		],
		roomMeshSettings: [],
	}),
	useEnemySceneController: () => ({
		handleEnemyDead: vi.fn(),
		handleEnemyAttack: vi.fn(),
	}),
}));

describe("SceneEnvironment", () => {
	it("passes composed EnemyMesh settings and actions", () => {
		mockEnemyMesh.mockClear();

		render(
			<SceneEnvironment
				environment={{} as CanvasEnvironmentSettings}
				playerSpawnPosition={[0, 0.9, 0]}
			/>,
		);

		expect(mockEnemyMesh).toHaveBeenCalledTimes(1);
		expect(mockEnemyMesh).toHaveBeenCalledWith(
			expect.objectContaining({
				actions: expect.objectContaining({
					onAttack: expect.any(Function),
					onDead: expect.any(Function),
				}),
				settings: expect.objectContaining({
					id: "guard-room-enemy-1",
					patrolCenter: [0, 1, 0],
					position: [0, 1, 0],
					roomId: "guard-room",
				}),
			}),
		);
	});
});
