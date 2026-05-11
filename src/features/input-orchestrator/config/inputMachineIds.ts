export const INPUT_MACHINE_IDS = {
	INPUT_ORCHESTRATOR: "input.machine.orchestrator",
	MOVEMENT_INPUT: "input.machine.movement",
	LOOK_INPUT: "input.machine.look",
	ZOOM_INPUT: "input.machine.zoom",
	DISCRETE_ACTION_INPUT: "input.machine.discreteAction",
} as const;

export type InputMachineId =
	(typeof INPUT_MACHINE_IDS)[keyof typeof INPUT_MACHINE_IDS];
