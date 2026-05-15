import type { PointerRole } from "@/shared/config";

export type PointerOwnershipRecord = {
	readonly pointerId: number;
	readonly role: PointerRole;
};

export type PointerOwnershipSnapshot = ReadonlyArray<PointerOwnershipRecord>;

type IsPointerOwnedByRoleInput = {
	readonly pointerId: number;
	readonly role: PointerRole;
	readonly ownership: PointerOwnershipSnapshot;
};

export const isPointerOwnedByRole = ({
	pointerId,
	role,
	ownership,
}: IsPointerOwnedByRoleInput): boolean =>
	ownership.some(
		(record) => record.pointerId === pointerId && record.role === role,
	);
