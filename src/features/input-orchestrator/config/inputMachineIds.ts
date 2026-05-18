export const INPUT_MACHINE_IDS = {
	INPUT_ORCHESTRATOR: "input.machine.orchestrator",
} as const;

export type InputMachineId =
	(typeof INPUT_MACHINE_IDS)[keyof typeof INPUT_MACHINE_IDS];
