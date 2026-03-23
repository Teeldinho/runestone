import { useMutation } from "@tanstack/react-query";

export type SubmitDungeonScoreInput = {
	userId: string;
	dungeonId: string;
	score: number;
	timeMs: number;
	roomsDiscovered: number;
};

export const useSubmitDungeonScore = () =>
	useMutation({
		mutationFn: (_args: SubmitDungeonScoreInput): Promise<void> =>
			Promise.resolve(),
	});
