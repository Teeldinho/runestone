import { createFloorOneMachine } from "@/entities/dungeon";
import {
	createDungeonFloorLayout,
	type DungeonRoomLayout,
} from "@/entities/room";

export const createFloorOneDungeonRooms = (): DungeonRoomLayout[] =>
	createDungeonFloorLayout(createFloorOneMachine()).rooms;
