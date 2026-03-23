import { createFileRoute } from "@tanstack/react-router";

import { TutorialPage } from "@/pages/tutorial";

export const Route = createFileRoute("/tutorial")({
	component: TutorialPage,
});
