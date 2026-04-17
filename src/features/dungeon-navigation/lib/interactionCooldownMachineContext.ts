import {
	INTERACTION_COOLDOWN_MACHINE_CONTEXT_KEYS,
	INTERACTION_COOLDOWN_MACHINE_DEFAULT_MS,
	INTERACTION_COOLDOWN_MS,
} from "../config";

import type { InteractionCooldownMachineContext } from "../model/interactionCooldownMachineTypes";

export const createReadyInteractionCooldownContext =
	(): InteractionCooldownMachineContext => ({
		[INTERACTION_COOLDOWN_MACHINE_CONTEXT_KEYS.COOLDOWN_MS]:
			INTERACTION_COOLDOWN_MACHINE_DEFAULT_MS,
	});

export const createInteractInteractionCooldownContext =
	(): InteractionCooldownMachineContext => ({
		[INTERACTION_COOLDOWN_MACHINE_CONTEXT_KEYS.COOLDOWN_MS]:
			INTERACTION_COOLDOWN_MS.INTERACT,
	});

export const createAttackInteractionCooldownContext =
	(): InteractionCooldownMachineContext => ({
		[INTERACTION_COOLDOWN_MACHINE_CONTEXT_KEYS.COOLDOWN_MS]:
			INTERACTION_COOLDOWN_MS.ATTACK,
	});
