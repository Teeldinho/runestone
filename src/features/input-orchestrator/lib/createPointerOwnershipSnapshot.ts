import type {
	PointerOwnershipRecord,
	PointerOwnershipSnapshot,
} from "./isPointerOwnedByRole";

type CreatePointerOwnershipSnapshotInput = {
	readonly currentOwnership: PointerOwnershipSnapshot;
	readonly nextRecord: PointerOwnershipRecord;
};

export const createPointerOwnershipSnapshot = ({
	currentOwnership,
	nextRecord,
}: CreatePointerOwnershipSnapshotInput): PointerOwnershipSnapshot => [
	...currentOwnership.filter(
		(record) => record.pointerId !== nextRecord.pointerId,
	),
	nextRecord,
];
