import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type UserProfile, userQueries } from "@/entities/user";
import { api, convexClient } from "@/shared/api";

type CreateUserInput = {
	uuid: string;
	username: string;
};

export const useCreateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			uuid,
			username,
		}: CreateUserInput): Promise<UserProfile> =>
			convexClient.mutation(api.users.createOrGetUserProfileByUuid, {
				uuid,
				username,
			}),
		onSuccess: (profile, variables) => {
			queryClient.setQueryData(
				userQueries.byUuid(variables.uuid).queryKey,
				profile,
			);
		},
	});
};
