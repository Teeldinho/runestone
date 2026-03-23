import { createFileRoute, redirect } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { AUTH_ROUTE_PATHS, hasPersistedAuthSession } from "@/features/auth";
import { APP_CONFIG } from "../../../app.config";

const GamePage = lazy(() =>
	import("@/pages/game").then((m) => ({ default: m.GamePage })),
);

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
	component: LazyGamePage,
});

function LazyGamePage() {
	return (
		<Suspense fallback={null}>
			<GamePage />
		</Suspense>
	);
}
