import { TriangleAlert } from "lucide-react";

import {
	Alert,
	AlertAction,
	AlertDescription,
	AlertTitle,
	Badge,
	Button,
} from "@/shared/ui";

import { HOME_STATUS_COPY } from "../config";

type HomeBootstrapFailedStatusCardProps = {
	errorMessage: string | null;
	onRetry: () => void;
};

export function HomeBootstrapFailedStatusCard({
	errorMessage,
	onRetry,
}: HomeBootstrapFailedStatusCardProps) {
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
