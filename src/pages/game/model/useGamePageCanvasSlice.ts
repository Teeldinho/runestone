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

	return {
		cameraStateSnapshot,
		canvasMachineRuntime: {
			currentRoomId: currentRoomId as RoomId,
			enemiesRemaining,
			hasTreasureKey,
		},
		handleCameraModeSwitch,
	};
};

export type { UseGamePageCanvasSliceInput };
