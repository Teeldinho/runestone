export type ScoreEntry = {
	userId: string;
	username: string;
	discriminator: string;
	floorId: string;
	score: number;
	timeMs: number;
	roomsDiscovered: number;
	completedAt: number;
};

export type ScoreSubmission = {
	floorId: string;
	score: number;
	timeMs: number;
	roomsDiscovered: number;
};
