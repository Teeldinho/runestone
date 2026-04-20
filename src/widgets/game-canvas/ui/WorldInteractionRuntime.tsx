import {
	type InteractionCandidatesViewModel,
	useInteractionCandidates,
	useInteractionInput,
	useSendDungeonMachineEvent,
} from "@/features/dungeon-navigation";

import { useRoomPositionsById } from "../model/useRoomPositionsById";

import { WorldInteractionPrompt } from "./WorldInteractionPrompt";

export function WorldInteractionRuntime() {
	const sendDungeonMachineEvent = useSendDungeonMachineEvent();
	const interactionCandidates = useInteractionCandidates();
	const roomPositionsById = useRoomPositionsById();

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
