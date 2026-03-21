import type { DungeonMachineEvent } from "@/entities/dungeon";

export const DUNGEON_MACHINE_SYSTEM_EVENTS = {
	RESET_DUNGEON_RUN: "RESET_DUNGEON_RUN",
} as const;

type DungeonMachineSystemEvent = {
	type: (typeof DUNGEON_MACHINE_SYSTEM_EVENTS)[keyof typeof DUNGEON_MACHINE_SYSTEM_EVENTS];
};

export type GameMachineEvent = DungeonMachineEvent | DungeonMachineSystemEvent;
