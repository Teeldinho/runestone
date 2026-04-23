import type { RoomId } from "@/entities/dungeon";

import type { GamePageViewModel } from "./types";
import { useGamePageAudioSlice } from "./useGamePageAudioSlice";
import { useGamePageCanvasSlice } from "./useGamePageCanvasSlice";
import { useGamePageHudSlice } from "./useGamePageHudSlice";
import { useGamePageLayoutSlice } from "./useGamePageLayoutSlice";
import { useGamePageMachineState } from "./useGamePageMachineState";
import { useGamePageMobileSheetSlice } from "./useGamePageMobileSheetSlice";
import { useGamePageTouchSlice } from "./useGamePageTouchSlice";
import { useGamePageVisualizerSlice } from "./useGamePageVisualizerSlice";

export const useGamePageSlices = (): GamePageViewModel => {
	const { cameraMachine, gameMachine, layout, playerMachine } =
		useGamePageMachineState();

	const { audio, audioState } = useGamePageAudioSlice();

	const touch = useGamePageTouchSlice({
		handleDungeonEventSend: gameMachine.navigation.handleDungeonEventSend,
		sendPlayerMachineEvent: playerMachine.sendPlayerMachineEvent,
	});

	const mobileSheet = useGamePageMobileSheetSlice({
		isMobileTabletLandscape: layout.isMobileTabletLandscape,
	});

	const hud = useGamePageHudSlice({
		gameMachine,
		playerMachine,
	});

	const canvas = useGamePageCanvasSlice({
		cameraMachine,
		gameMachine,
	});

	const layoutSlice = useGamePageLayoutSlice({
		layout,
	});

	const visualizer = useGamePageVisualizerSlice({
		audioState,
		cameraMode: cameraMachine.mode,
		currentRoomId: gameMachine.room.currentRoomId as RoomId,
		playerStateValue: playerMachine.snapshot.value,
	});

	return {
		audio,
		canvas,
		hud,
		layout: layoutSlice,
		mobileSheet,
		touch,
		visualizer,
	};
};
