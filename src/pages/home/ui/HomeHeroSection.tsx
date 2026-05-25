import { Link } from "@tanstack/react-router";
import { DoorOpen } from "lucide-react";

import type { AuthStatus } from "@/features/auth";
import { Badge, Button } from "@/shared/ui";
import { MARKETING_ROUTES } from "@/widgets/marketing-shell";

import { HOME_COPY } from "../config";

import { HomeBootstrapStatusCard } from "./HomeBootstrapStatusCard";

type HomeHeroSectionProps = {
	authStatus: AuthStatus;
	errorMessage: string | null;
	isAuthenticated: boolean;
	onEntryRequest: () => void;
	onRetry: () => void;
	readyStatusLabel: string | null;
};

export function HomeHeroSection({
	authStatus,
	errorMessage,
	isAuthenticated,
	onEntryRequest,
	onRetry,
	readyStatusLabel,
}: HomeHeroSectionProps) {
	return (
		<section className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
			<Badge
				variant="outline"
				className="w-fit border-dungeon-gold/40 bg-background/60 text-dungeon-gold"
			>
				{HOME_COPY.BADGE}
			</Badge>

			<div className="space-y-4">
				<h1 className="text-balance text-4xl font-bold tracking-tight text-panel-title sm:text-5xl lg:text-6xl">
					{HOME_COPY.HEADING}
				</h1>
				<p className="mx-auto max-w-3xl text-balance text-base leading-7 text-panel-body sm:text-lg">
					{HOME_COPY.SUBTITLE}
				</p>
			</div>

			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
				{isAuthenticated ? (
					<Button asChild size="lg">
						<Link to={MARKETING_ROUTES.GAME}>
							<DoorOpen className="size-4" />
							{HOME_COPY.CTA_LABEL}
						</Link>
					</Button>
				) : (
					<Button type="button" size="lg" onClick={onEntryRequest}>
						<DoorOpen className="size-4" />
						{HOME_COPY.CTA_LABEL}
					</Button>
				)}

				<Button asChild size="lg" variant="dungeon-gold">
					<Link to={MARKETING_ROUTES.GUIDE}>{HOME_COPY.TUTORIAL_LABEL}</Link>
				</Button>
			</div>

			<div className="w-full max-w-2xl space-y-4">
				<HomeBootstrapStatusCard
					authStatus={authStatus}
					errorMessage={errorMessage}
					onRetry={onRetry}
					readyStatusLabel={readyStatusLabel}
				/>

				<div className="rounded-lg border border-dungeon-gold/35 bg-dungeon-gold/10 p-4 text-left sm:hidden">
					<p className="text-sm leading-6 text-panel-body">
						{HOME_COPY.MOBILE_ORIENTATION_NOTICE}
					</p>
				</div>
			</div>
		</section>
	);
}
