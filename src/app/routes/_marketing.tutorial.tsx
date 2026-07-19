import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/tutorial")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "controls",
			statusCode: 301,
		});
	},
});
