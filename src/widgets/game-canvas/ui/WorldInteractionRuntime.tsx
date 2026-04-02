import { useMemo } from "react";

import { createFloorOneMachine, type RoomId } from "@/entities/dungeon";
import { createDungeonFloorLayout } from "@/entities/room";
import {
	type InteractionCandidatesViewModel,
	useInteractionCandidates,
	useInteractionInput,
	useSendDungeonMachineEvent,
} from "@/features/dungeon-navigation";
import type { Vector3Tuple } from "@/shared/types";

import type { RoomPositionsById } from "../lib/getWorldInteractionPromptPosition";

import { WorldInteractionPrompt } from "./WorldInteractionPrompt";

export function WorldInteractionRuntime() {
	const sendDungeonMachineEvent = useSendDungeonMachineEvent();
	const interactionCandidates = useInteractionCandidates();
	const roomPositionsById = useMemo<RoomPositionsById>(
		() =>
			createDungeonFloorLayout(createFloorOneMachine()).rooms.reduce<
				Partial<Record<RoomId, Vector3Tuple>>
			>((positionsById, room) => {
				positionsById[room.roomId as RoomId] = room.position;
				return positionsById;
			}, {}),
		[],
	);

	useInteractionInput({
		candidates: interactionCandidates,
		sendDungeonMachineEvent,
	});

	return (
		<WorldInteractionPrompt
			interactionCandidates={
				interactionCandidates as InteractionCandidatesViewModel
			}
			roomPositionsById={roomPositionsById}
		/>
	);
}
