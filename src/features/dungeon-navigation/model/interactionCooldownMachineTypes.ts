import type { INTERACTION_COOLDOWN_MACHINE_EVENTS } from "../config";

export type InteractionCooldownMachineContext = {
	cooldownMs: number;
};

export type InteractionCooldownMachineEvent =
	| {
			type: (typeof INTERACTION_COOLDOWN_MACHINE_EVENTS)["START_INTERACT"];
	  }
	| {
			type: (typeof INTERACTION_COOLDOWN_MACHINE_EVENTS)["START_ATTACK"];
	  }
	| {
			type: (typeof INTERACTION_COOLDOWN_MACHINE_EVENTS)["RESET"];
	  };
