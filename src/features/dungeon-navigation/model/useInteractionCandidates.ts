import { shallowEqual } from "@xstate/react";
import { useMemo, useSyncExternalStore } from "react";

import { EMPTY_INTERACTION_CANDIDATES } from "../config";
import {
	createInteractionCandidatesRuntime,
	type InteractionCandidatesViewModel,
} from "../lib/interactionCandidatesRuntime";
import {
	selectInteractionCandidatesContext,
	useGameMachineSelector,
} from "./gameMachineRuntime";

export const useInteractionCandidates = (): InteractionCandidatesViewModel => {
	const context = useGameMachineSelector(
		selectInteractionCandidatesContext,
		shallowEqual,
	);

	const api = useMemo(
		() => createInteractionCandidatesRuntime(context),
		[context],
	);

	return useSyncExternalStore(
		api.subscribe,
		api.getSnapshot,
		() => EMPTY_INTERACTION_CANDIDATES,
	);
};

export type { InteractionCandidatesViewModel };
