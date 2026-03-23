import type { UserProfile } from "@/entities/user";

export const checkHasProfile = (
	profile: UserProfile | null | undefined,
): boolean => Boolean(profile);
