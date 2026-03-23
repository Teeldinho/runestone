import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AppProviders } from "@/app/providers";

import appCss from "@/app/styles/globals.css?url";

function NotFoundPage() {
	return (
		<div className="flex h-dvh flex-col items-center justify-center gap-4 bg-[var(--background)] text-[var(--foreground)]">
			<p className="font-mono text-6xl font-bold tracking-widest text-[var(--primary)]">
				404
			</p>
			<p className="text-lg text-[var(--muted-foreground)]">
				This passage does not exist.
			</p>
			<a
				href="/"
				className="mt-2 rounded border border-[var(--border)] px-4 py-2 text-sm text-[var(--accent)] transition-colors hover:border-[var(--accent)]"
			>
				Return to entrance
			</a>
		</div>
	);
}

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Runestone",
			},
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	notFoundComponent: NotFoundPage,
	shellComponent: RootShell,
	component: RootOutlet,
});

function RootShell({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:border focus:border-ring focus:rounded-md"
				>
					Skip to main content
				</a>
				{children}
				<Scripts />
			</body>
		</html>
	);
}

function RootOutlet() {
	return (
		<AppProviders>
			<Outlet />
		</AppProviders>
	);
}
