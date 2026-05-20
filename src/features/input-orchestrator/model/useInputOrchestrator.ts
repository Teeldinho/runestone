import { useActorRef, useSelector } from "@xstate/react";
import type { SnapshotFrom } from "xstate";

import type { InputOrchestratorInput } from "./inputOrchestratorMachine";
import { inputOrchestratorMachine } from "./inputOrchestratorMachine";

type InputOrchestratorSnapshot = SnapshotFrom<typeof inputOrchestratorMachine>;

const selectIsRunToggled = (snapshot: InputOrchestratorSnapshot): boolean =>
	snapshot.context.isRunToggled;

const selectInputStateValue = (
	snapshot: InputOrchestratorSnapshot,
): InputOrchestratorSnapshot["value"] => snapshot.value;

export const useInputOrchestrator = (input: InputOrchestratorInput) => {
	const actorRef = useActorRef(inputOrchestratorMachine, {
		input,
	});

	const isRunToggled = useSelector(actorRef, selectIsRunToggled);
	const inputStateValue = useSelector(actorRef, selectInputStateValue);

	return {
		actorRef,
		inputStateValue,
		sendInput: actorRef.send,
		isRunToggled,
	};
};
