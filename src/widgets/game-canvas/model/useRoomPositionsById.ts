import { useMemo } from "react";

import { createFloorOneMachine, type RoomId } from "@/entities/dungeon";
import { createDungeonFloorLayout } from "@/entities/room";
import type { Vector3Tuple } from "@/shared/lib";

import type { RoomPositionsById } from "../lib/getWorldInteractionPromptPosition";

export const useRoomPositionsById = (): RoomPositionsById =>
	useMemo<RoomPositionsById>(
		() =>
			createDungeonFloorLayout(createFloorOneMachine()).rooms.reduce<
				Partial<Record<RoomId, Vector3Tuple>>
			>((positionsById, room) => {
				positionsById[room.roomId as RoomId] = room.position;
				return positionsById;
			}, {}),
		[],
	);
