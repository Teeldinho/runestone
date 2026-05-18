import { useActorRef, useSelector } from "@xstate/react";
import type { SnapshotFrom } from "xstate";

import type { InputOrchestratorInput } from "./inputOrchestratorMachine";
import { inputOrchestratorMachine } from "./inputOrchestratorMachine";

type InputOrchestratorSnapshot = SnapshotFrom<typeof inputOrchestratorMachine>;

const selectIsDesktopRunHeld = (snapshot: InputOrchestratorSnapshot): boolean =>
	snapshot.context.isDesktopRunHeld;

const selectIsMobileRunToggled = (
	snapshot: InputOrchestratorSnapshot,
): boolean => snapshot.context.isMobileRunToggled;

const selectInputStateValue = (
	snapshot: InputOrchestratorSnapshot,
): InputOrchestratorSnapshot["value"] => snapshot.value;

export const useInputOrchestrator = (input: InputOrchestratorInput) => {
	const actorRef = useActorRef(inputOrchestratorMachine, {
		input,
	});

	const isDesktopRunHeld = useSelector(actorRef, selectIsDesktopRunHeld);
	const isMobileRunToggled = useSelector(actorRef, selectIsMobileRunToggled);
	const inputStateValue = useSelector(actorRef, selectInputStateValue);

	return {
		actorRef,
		inputStateValue,
		sendInput: actorRef.send,
		isDesktopRunHeld,
		isMobileRunToggled,
	};
};
