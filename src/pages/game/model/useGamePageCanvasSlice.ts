import type { RoomId } from "@/entities/dungeon";

import type { GamePageMachineState } from "./useGamePageMachineState";

type UseGamePageCanvasSliceInput = {
	cameraMachine: GamePageMachineState["cameraMachine"];
	gameMachine: Pick<GamePageMachineState["gameMachine"], "room" | "status">;
};

export const useGamePageCanvasSlice = ({
	cameraMachine,
	gameMachine,
}: UseGamePageCanvasSliceInput) => {
	const { cameraStateSnapshot, handleCameraModeSwitch } = cameraMachine;
	const { room, status } = gameMachine;
	const { currentRoomId } = room;
	const { enemiesRemaining, hasTreasureKey } = status;

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
