import { convexQuery } from "@convex-dev/react-query";

import { api } from "@/shared/api";

import { USER_QUERY_KEYS } from "./queryKeys";

export const userQueries = {
	keys: USER_QUERY_KEYS,
	byUuid: (uuid: string) => convexQuery(api.users.getByUuid, { uuid }),
} as const;
