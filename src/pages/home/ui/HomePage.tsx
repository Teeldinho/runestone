import { Link } from "@tanstack/react-router";

import {
	AUTH_COPY,
	AUTH_ROUTE_PATHS,
	UsernameModal,
	useAuthContext,
} from "@/features/auth";
import {
	Button,
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/ui";

export function HomePage() {
	const {
		errorMessage,
		handleUsernameFormSubmit,
		isAuthenticated,
		isUsernameModalOpen,
		isUsernameSubmitting,
		readyStatusLabel,
	} = useAuthContext();

	return (
		<>
			<main
				id="main-content"
				className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center p-8"
			>
				<Card className="w-full border-panel-border bg-panel text-center shadow-xl backdrop-blur">
					<CardHeader className="space-y-4">
						<CardTitle className="text-3xl font-semibold text-panel-title">
							Runestone
						</CardTitle>
						<CardDescription className="text-base text-panel-body">
							Enter the dungeon and learn live state machines.
						</CardDescription>
						{readyStatusLabel ? (
							<p className="text-sm font-medium text-panel-title">
								{AUTH_COPY.READY_STATUS_PREFIX} {readyStatusLabel}
							</p>
						) : null}
						{isAuthenticated ? (
							<Button asChild className="mx-auto">
								<Link to={AUTH_ROUTE_PATHS.GAME}>Continue to Game Arena</Link>
							</Button>
						) : null}
					</CardHeader>
				</Card>
			</main>
			<UsernameModal
				errorMessage={errorMessage}
				isOpen={isUsernameModalOpen}
				isSubmitting={isUsernameSubmitting}
				onSubmit={handleUsernameFormSubmit}
			/>
		</>
	);
}
