import { createFileRoute } from "@tanstack/react-router";

import { APP_CONFIG } from "../../../app.config";

import { GameRouteContent } from "./-GameRouteContent";
import { GameRoutePendingShell } from "./-GameRoutePendingShell";
import { requirePersistedAuthSession } from "./-requirePersistedAuthSession";

export const Route = createFileRoute("/game")({
	ssr: APP_CONFIG.SSR,
	beforeLoad: requirePersistedAuthSession,
	component: GameRouteContent,
	pendingComponent: GameRoutePendingShell,
	pendingMs: 0,
	pendingMinMs: 0,
});
