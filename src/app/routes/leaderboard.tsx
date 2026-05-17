import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardPage } from "@/pages/leaderboard";
import { APP_CONFIG } from "../../../app.config";

import { requirePersistedAuthSession } from "./-requirePersistedAuthSession";

export const Route = createFileRoute("/leaderboard")({
	ssr: APP_CONFIG.SSR,
	beforeLoad: requirePersistedAuthSession,
	component: LeaderboardPage,
});
