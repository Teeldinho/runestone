import type { RoomId } from "@/entities/dungeon";
import type { Vector3Tuple } from "@/shared/types";

export type NavigationIntent = "move" | "interact" | "inspect";

export type NavigationTarget = {
	roomId: RoomId;
	worldPosition: Vector3Tuple;
	intent: NavigationIntent;
};

export type NavigationPrompt = {
	label: string;
	condition: string;
	isLocked: boolean;
};
