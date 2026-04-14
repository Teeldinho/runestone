import type { RoomId } from "@/entities/dungeon";
import type { Vector3Tuple } from "@/shared/lib";

import type { NAVIGATION_INTENTS } from "../config";

export type NavigationIntent =
	(typeof NAVIGATION_INTENTS)[keyof typeof NAVIGATION_INTENTS];

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
