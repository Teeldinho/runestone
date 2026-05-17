import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { APP_CONFIG } from "../../../app.config";

import { requirePersistedAuthSession } from "./-requirePersistedAuthSession";

const GamePage = lazy(() =>
	import("@/pages/game").then((m) => ({ default: m.GamePage })),
);

export const Route = createFileRoute("/game")({
	ssr: APP_CONFIG.SSR,
	beforeLoad: requirePersistedAuthSession,
	component: LazyGamePage,
});

function LazyGamePage() {
	return (
		<Suspense fallback={null}>
			<GamePage />
		</Suspense>
	);
}
