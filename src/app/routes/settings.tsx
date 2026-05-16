import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/pages/settings";
import { APP_CONFIG } from "../../../app.config";

import { requirePersistedAuthSession } from "./-requirePersistedAuthSession";

export const Route = createFileRoute("/settings")({
	ssr: APP_CONFIG.SSR,
	beforeLoad: () => {
		if (typeof window === "undefined") {
			return;
		}

		requirePersistedAuthSession(window.localStorage);
	},
	component: SettingsPage,
});
