import {
	CheckCircle2,
	KeyRound,
	LoaderCircle,
	ShieldCheck,
	TriangleAlert,
} from "lucide-react";

import { AUTH_STATUS, type AuthStatus } from "@/features/auth";
import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
	Badge,
	Button,
	Skeleton,
} from "@/shared/ui";

import { HOME_STATUS_COPY } from "../config";

type HomeBootstrapStatusCardProps = {
	authStatus: AuthStatus;
	errorMessage: string | null;
	onRetry: () => void;
	readyStatusLabel: string | null;
};

export function HomeBootstrapStatusCard({
	authStatus,
	errorMessage,
	onRetry,
	readyStatusLabel,
}: HomeBootstrapStatusCardProps) {
	if (authStatus === AUTH_STATUS.CHECKING_SESSION) {
		return (
			<section
				aria-label="Session status"
				aria-live="polite"
				className="mx-auto w-full max-w-xl rounded-xl bg-background/15 px-4 py-4 text-center sm:px-5"
			>
				<div className="flex flex-col items-center gap-3">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-dungeon-gold/10 text-dungeon-gold">
						<LoaderCircle className="size-4 animate-spin" />
					</div>
					<div className="min-w-0 space-y-1.5">
						<div className="flex flex-wrap items-center justify-center gap-2">
							<Badge
								variant="outline"
								className="border-dungeon-gold/30 text-dungeon-gold"
							>
								{HOME_STATUS_COPY.CHECKING_SESSION.badge}
							</Badge>
							<p className="text-sm font-semibold text-panel-title">
								{HOME_STATUS_COPY.CHECKING_SESSION.title}
							</p>
						</div>
						<p className="text-sm leading-6 text-panel-body">
							{HOME_STATUS_COPY.CHECKING_SESSION.description}
						</p>
						<div className="space-y-2 pt-1">
							<Skeleton className="h-3.5 w-4/5 bg-dungeon-gold/10" />
							<p className="text-xs leading-5 text-muted-foreground">
								{HOME_STATUS_COPY.CHECKING_SESSION.detail}
							</p>
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (authStatus === AUTH_STATUS.BOOTSTRAP_FAILED) {
		return (
			<Alert
				variant="destructive"
				className="w-full items-start gap-3 rounded-xl border-destructive/30 bg-destructive/5 px-4 py-4 sm:px-5"
			>
				<TriangleAlert className="size-4" />
				<div className="min-w-0 w-full space-y-1.5">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="destructive" className="shrink-0">
							{HOME_STATUS_COPY.BOOTSTRAP_FAILED.badge}
						</Badge>
						<AlertTitle className="text-sm font-semibold text-panel-title">
							{HOME_STATUS_COPY.BOOTSTRAP_FAILED.title}
						</AlertTitle>
					</div>
					<AlertDescription className="text-sm leading-6 text-panel-body">
						{errorMessage ?? HOME_STATUS_COPY.BOOTSTRAP_FAILED.description}
					</AlertDescription>
					<p className="text-xs leading-5 text-muted-foreground">
						{HOME_STATUS_COPY.BOOTSTRAP_FAILED.detail}
					</p>
				</div>
				<AlertAction>
					<Button size="sm" variant="destructive" onClick={onRetry}>
						{HOME_STATUS_COPY.BOOTSTRAP_FAILED.actionLabel}
					</Button>
				</AlertAction>
			</Alert>
		);
	}

	if (authStatus === AUTH_STATUS.AUTHENTICATED) {
		return (
			<section
				aria-label="Session status"
				aria-live="polite"
				className="mx-auto w-full max-w-xl rounded-xl bg-background/15 px-4 py-4 text-center sm:px-5"
			>
				<div className="flex flex-col items-center gap-3">
					<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-dungeon-gold/10 text-dungeon-gold">
						<ShieldCheck className="size-4" />
					</div>
					<div className="min-w-0 space-y-1.5">
						<div className="flex flex-wrap items-center justify-center gap-2">
							<Badge
								variant="outline"
								className="border-dungeon-gold/30 text-dungeon-gold"
							>
								{HOME_STATUS_COPY.AUTHENTICATED.badge}
							</Badge>
							<p className="text-sm font-semibold text-panel-title">
								{HOME_STATUS_COPY.AUTHENTICATED.title}
							</p>
						</div>
						<p className="text-sm leading-6 text-panel-body">
							{HOME_STATUS_COPY.AUTHENTICATED.description}
						</p>
						<div className="flex flex-wrap items-center gap-2 text-xs leading-5 text-muted-foreground">
							{readyStatusLabel ? (
								<span className="inline-flex items-center gap-1.5 rounded-full border border-panel-border/80 px-2 py-1">
									<CheckCircle2 className="size-3.5 text-dungeon-gold" />
									{readyStatusLabel}
								</span>
							) : null}
							<span>{HOME_STATUS_COPY.AUTHENTICATED.detail}</span>
						</div>
					</div>
				</div>
			</section>
		);
	}

	const isSubmittingUsername = authStatus === AUTH_STATUS.SUBMITTING_USERNAME;

	return (
		<section
			aria-label="Session status"
			aria-live="polite"
			className="mx-auto w-full max-w-xl rounded-xl bg-background/15 px-4 py-4 text-center sm:px-5"
		>
			<div className="flex flex-col items-center gap-3">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-dungeon-gold/10 text-dungeon-gold">
					{isSubmittingUsername ? (
						<LoaderCircle className="size-4 animate-spin" />
					) : (
						<KeyRound className="size-4" />
					)}
				</div>
				<div className="min-w-0 space-y-1.5">
					<div className="flex flex-wrap items-center justify-center gap-2">
						<Badge
							variant="outline"
							className="border-dungeon-gold/30 text-dungeon-gold"
						>
							{isSubmittingUsername
								? HOME_STATUS_COPY.SUBMITTING_USERNAME.badge
								: HOME_STATUS_COPY.REQUIRES_USERNAME.badge}
						</Badge>
						<p className="text-sm font-semibold text-panel-title">
							{isSubmittingUsername
								? HOME_STATUS_COPY.SUBMITTING_USERNAME.title
								: HOME_STATUS_COPY.REQUIRES_USERNAME.title}
						</p>
					</div>
					<p className="text-sm leading-6 text-panel-body">
						{isSubmittingUsername
							? HOME_STATUS_COPY.SUBMITTING_USERNAME.description
							: HOME_STATUS_COPY.REQUIRES_USERNAME.description}
					</p>
					<p className="text-xs leading-5 text-muted-foreground">
						{isSubmittingUsername
							? HOME_STATUS_COPY.SUBMITTING_USERNAME.detail
							: HOME_STATUS_COPY.REQUIRES_USERNAME.detail}
					</p>
				</div>
			</div>
		</section>
	);
}
