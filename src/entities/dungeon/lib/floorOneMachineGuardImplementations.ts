import { FLOOR_ONE_GUARD_KEYS } from "../config";
import type {
	DungeonInteractableId,
	DungeonMachineContext,
} from "../model/types";
import {
	canEnterFloorOneExit,
	canEnterFloorOneTreasury,
} from "./floorOneContext";
import {
	checkFloorOneCanPickUpTreasureKey,
	checkFloorOneNearInteractable,
} from "./floorOneMachineGuards";

export const FLOOR_ONE_GUARD_IMPLEMENTATIONS = {
	[FLOOR_ONE_GUARD_KEYS.IS_NEAR_INTERACTABLE]: (
		{ context }: { context: DungeonMachineContext },
		params: { interactableId: DungeonInteractableId },
	) => checkFloorOneNearInteractable(context, params.interactableId),
	[FLOOR_ONE_GUARD_KEYS.CAN_PICK_UP_TREASURE_KEY]: ({
		context,
	}: {
		context: DungeonMachineContext;
	}) => checkFloorOneCanPickUpTreasureKey(context),
	[FLOOR_ONE_GUARD_KEYS.TREASURY_CAN_BE_ENTERED]: ({
		context,
	}: {
		context: DungeonMachineContext;
	}) => canEnterFloorOneTreasury(context),
	[FLOOR_ONE_GUARD_KEYS.EXIT_CAN_BE_ENTERED]: ({
		context,
	}: {
		context: DungeonMachineContext;
	}) => canEnterFloorOneExit(context),
} as const;
