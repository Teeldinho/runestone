import { createFileRoute, redirect } from "@tanstack/react-router";

import { AUTH_ROUTE_PATHS, hasPersistedAuthSession } from "@/features/auth";
import { GamePage } from "@/pages/game";
import { APP_CONFIG } from "../../../app.config";

export const Route = createFileRoute("/game")({
	ssr: APP_CONFIG.SSR,
	beforeLoad: () => {
		if (typeof window === "undefined") {
			return;
		}

		if (!hasPersistedAuthSession(window.localStorage)) {
			throw redirect({
				to: AUTH_ROUTE_PATHS.HOME,
			});
		}
	},
	component: GamePage,
});
