import { createFileRoute } from "@tanstack/react-router";

import { TutorialPage } from "@/pages/tutorial";

export const Route = createFileRoute("/_marketing/tutorial")({
	component: TutorialPage,
});
