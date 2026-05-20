import type {
	IntersectionEnterPayload,
	IntersectionExitPayload,
} from "@react-three/rapier";
import { PHYSICS_COLLIDER_NAMES } from "@/shared/config";

import { PLAYER_EVENT_TYPES } from "../config";

type PlayerGroundSensorIntersectionPayload =
	| IntersectionEnterPayload
	| IntersectionExitPayload;

type ResolvePlayerGroundContactKeyInput = Pick<
	PlayerGroundSensorIntersectionPayload,
	"other"
>;

type AddPlayerGroundContactHandleInput = {
	readonly currentGroundContactHandles: ReadonlySet<number>;
	readonly groundContactHandle: number;
};

type RemovePlayerGroundContactHandleInput = {
	readonly currentGroundContactHandles: ReadonlySet<number>;
	readonly groundContactHandle: number;
};

type ResolvePlayerGroundingMachineEventInput = {
	readonly previousIsGrounded: boolean;
	readonly nextIsGrounded: boolean;
};

type PlayerGroundingMachineEvent =
	| {
			readonly type: typeof PLAYER_EVENT_TYPES.LANDED;
	  }
	| {
			readonly type: typeof PLAYER_EVENT_TYPES.LEFT_GROUND;
	  };

export const resolvePlayerGroundContactKey = ({
	other,
}: ResolvePlayerGroundContactKeyInput): number | null => {
	const colliderObject = other.colliderObject;

	if (
		!colliderObject ||
		colliderObject.name !== PHYSICS_COLLIDER_NAMES.WALKABLE_GROUND
	) {
		return null;
	}

	return other.collider.handle;
};

export const addPlayerGroundContactHandle = ({
	currentGroundContactHandles,
	groundContactHandle,
}: AddPlayerGroundContactHandleInput): Set<number> => {
	const nextGroundContactHandles = new Set(currentGroundContactHandles);
	nextGroundContactHandles.add(groundContactHandle);

	return nextGroundContactHandles;
};

export const removePlayerGroundContactHandle = ({
	currentGroundContactHandles,
	groundContactHandle,
}: RemovePlayerGroundContactHandleInput): Set<number> => {
	const nextGroundContactHandles = new Set(currentGroundContactHandles);
	nextGroundContactHandles.delete(groundContactHandle);

	return nextGroundContactHandles;
};

export const resolvePlayerGroundingMachineEvent = ({
	previousIsGrounded,
	nextIsGrounded,
}: ResolvePlayerGroundingMachineEventInput): PlayerGroundingMachineEvent | null => {
	if (!previousIsGrounded && nextIsGrounded) {
		return {
			type: PLAYER_EVENT_TYPES.LANDED,
		};
	}

	if (previousIsGrounded && !nextIsGrounded) {
		return {
			type: PLAYER_EVENT_TYPES.LEFT_GROUND,
		};
	}

	return null;
};

export type {
	AddPlayerGroundContactHandleInput,
	PlayerGroundingMachineEvent,
	RemovePlayerGroundContactHandleInput,
	ResolvePlayerGroundContactKeyInput,
	ResolvePlayerGroundingMachineEventInput,
};
