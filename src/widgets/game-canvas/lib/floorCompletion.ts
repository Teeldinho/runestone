import { XSTATE_ACTOR_STATUS } from "@/shared/config";

export const shouldSubmitFloorScore = (
	snapshotStatus: string,
	hasSubmitted: boolean,
): boolean => snapshotStatus === XSTATE_ACTOR_STATUS.DONE && !hasSubmitted;
