import { useMutation } from "@tanstack/react-query";
import type { Id } from "convex/_generated/dataModel";

import { api, convexClient } from "@/shared/api";

export type SubmitDungeonScoreInput = {
	userId: string;
	dungeonId: string;
	score: number;
	timeMs: number;
	roomsDiscovered: number;
};

export const useSubmitDungeonScore = () =>
	useMutation({
		mutationFn: ({ userId, ...rest }: SubmitDungeonScoreInput) =>
			convexClient.mutation(api.scores.submitDungeonRunScore, {
				userId: userId as Id<"users">,
				...rest,
			}),
	});
