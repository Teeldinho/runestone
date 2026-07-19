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
		<div className="flex h-dvh flex-col items-center justify-center gap-4 bg-background text-foreground">
			<p className="font-mono text-6xl font-bold tracking-widest text-primary">
				404
			</p>
			<p className="text-lg text-muted-foreground">
				This passage does not exist.
			</p>
			<a
				href="/"
				className="mt-2 rounded border border-border px-4 py-2 text-sm text-accent transition-colors hover:border-accent"
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
				title: "Runestone — A Playable Statechart Dungeon",
			},
			{
				name: "description",
				content:
					"Explore a five-room 3D dungeon where rooms are states, corridors are transitions, and locked doors are guards. Watch the live statechart update as you play.",
			},
			{
				property: "og:title",
				content: "Runestone — A Playable Statechart Dungeon",
			},
			{
				property: "og:description",
				content:
					"Walk through executable logic and inspect the statechart that defines the dungeon.",
			},
			{
				property: "og:type",
				content: "website",
			},
			{
				name: "twitter:card",
				content: "summary",
			},
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "manifest", href: "/manifest.json" },
			{ rel: "icon", href: "/runestone-mark.svg", type: "image/svg+xml" },
		],
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
