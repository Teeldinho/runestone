import { describe, expect, it } from "vitest";

import type { ScoreEntry } from "@/entities/score";

import {
	formatLeaderboardEntries,
	formatRunDurationLabel,
} from "./leaderboardFormatters";

const SCORE_ENTRIES: ScoreEntry[] = [
	{
		userId: "user-1",
		username: "runestone_hero",
		discriminator: "D0001",
		floorId: "floor-one",
		score: 12345,
		timeMs: 125000,
		roomsDiscovered: 4,
		completedAt: 1739980000000,
	},
	{
		userId: "user-2",
		username: "mystic_path",
		discriminator: "D0002",
		floorId: "floor-one",
		score: 9000,
		timeMs: 59000,
		roomsDiscovered: 1,
		completedAt: 1739980010000,
	},
];

describe("leaderboardFormatters", () => {
	it("formats run duration as minutes and padded seconds", () => {
		expect(formatRunDurationLabel(125000)).toBe("2m 05s");
		expect(formatRunDurationLabel(59000)).toBe("0m 59s");
	});

	it("maps score entries into leaderboard display rows", () => {
		expect(formatLeaderboardEntries(SCORE_ENTRIES)).toEqual([
			{
				rowId: "user-1:1739980000000",
				rankLabel: "#1",
				playerLabel: "runestone_heroD0001",
				scoreLabel: "12,345",
				runTimeLabel: "2m 05s",
				roomsDiscoveredLabel: "4 rooms",
			},
			{
				rowId: "user-2:1739980010000",
				rankLabel: "#2",
				playerLabel: "mystic_pathD0002",
				scoreLabel: "9,000",
				runTimeLabel: "0m 59s",
				roomsDiscoveredLabel: "1 room",
			},
		]);
	});
});
