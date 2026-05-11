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

export const useInputOrchestrator = (input: InputOrchestratorInput) => {
	const actorRef = useActorRef(inputOrchestratorMachine, {
		input,
	});

	const isDesktopRunHeld = useSelector(actorRef, selectIsDesktopRunHeld);
	const isMobileRunToggled = useSelector(actorRef, selectIsMobileRunToggled);

	return {
		actorRef,
		sendInput: actorRef.send,
		isDesktopRunHeld,
		isMobileRunToggled,
	};
};
