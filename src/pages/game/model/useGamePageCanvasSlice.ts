import { useMemo } from "react";

import type { RoomId } from "@/entities/dungeon";

import type { GamePageMachineState } from "./useGamePageMachineState";

type UseGamePageCanvasSliceInput = {
	cameraMachine: GamePageMachineState["cameraMachine"];
	gameMachine: Pick<
		GamePageMachineState["gameMachine"],
		"currentRoomId" | "enemiesRemaining" | "hasTreasureKey"
	>;
};

export const useGamePageCanvasSlice = ({
	cameraMachine,
	gameMachine,
}: UseGamePageCanvasSliceInput) => {
	const { cameraStateSnapshot, handleCameraModeSwitch } = cameraMachine;
	const { currentRoomId, enemiesRemaining, hasTreasureKey } = gameMachine;

	return useMemo(
		() => ({
			cameraStateSnapshot,
			canvasMachineRuntime: {
				currentRoomId: currentRoomId as RoomId,
				enemiesRemaining,
				hasTreasureKey,
			},
			handleCameraModeSwitch,
		}),
		[
			cameraStateSnapshot,
			currentRoomId,
			enemiesRemaining,
			handleCameraModeSwitch,
			hasTreasureKey,
		],
	);
};

export type { UseGamePageCanvasSliceInput };
