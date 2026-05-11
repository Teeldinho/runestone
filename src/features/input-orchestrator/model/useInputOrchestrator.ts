import { useMachine } from "@xstate/react";

import type { InputOrchestratorInput } from "./inputOrchestratorMachine";
import { inputOrchestratorMachine } from "./inputOrchestratorMachine";

export const useInputOrchestrator = (input: InputOrchestratorInput) => {
	const [state, send] = useMachine(inputOrchestratorMachine, {
		input,
	});

	return {
		state,
		sendInput: send,
		isDesktopRunHeld: state.context.isDesktopRunHeld,
		isMobileRunToggled: state.context.isMobileRunToggled,
	};
};
