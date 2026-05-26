import { createFileRoute } from "@tanstack/react-router";

import { ConceptsPage } from "@/pages/concepts";

export const Route = createFileRoute("/_marketing/concepts")({
	component: ConceptsPage,
});
