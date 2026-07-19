import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/concepts")({
	beforeLoad: () => {
		throw redirect({
			to: "/",
			hash: "machine",
			statusCode: 301,
		});
	},
});
