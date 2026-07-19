import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { APP_CONFIG } from "../../../app.config";

import { requirePersistedAuthSession } from "./-requirePersistedAuthSession";

const GameRouteContent = lazy(() =>
	import("./-GameRouteContent").then((module) => ({
		default: module.GameRouteContent,
	})),
);

export const Route = createFileRoute("/game")({
	ssr: APP_CONFIG.SSR,
	beforeLoad: requirePersistedAuthSession,
	component: LazyGamePage,
});

function LazyGamePage() {
	return (
		<Suspense fallback={null}>
			<GameRouteContent />
		</Suspense>
	);
}
