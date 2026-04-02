import { USER_QUERY_KEY_ROOT } from "../config";

export const USER_QUERY_KEYS = {
	ALL: [USER_QUERY_KEY_ROOT] as const,
	BY_UUID: (uuid: string) => [USER_QUERY_KEY_ROOT, "byUuid", uuid] as const,
} as const;
