import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui";
import { AUTH_COPY } from "../config";
import type { UsernameFormInput } from "../model";

import { UsernameForm } from "./UsernameForm";

type UsernameModalProps = {
	errorMessage: string | null;
	isOpen: boolean;
	isSubmitting: boolean;
	suggestedUsername: string;
	onCloseAutoFocus?: (event: Event) => void;
	onKeepReading: () => void;
	onSubmit: (input: UsernameFormInput) => Promise<void>;
};

export function UsernameModal({
	errorMessage,
	isOpen,
	isSubmitting,
	suggestedUsername,
	onCloseAutoFocus,
	onKeepReading,
	onSubmit,
}: UsernameModalProps) {
	return (
		<Dialog open={isOpen}>
			<DialogContent
				showCloseButton={false}
				className="rounded-3xl border-panel-border bg-panel/95 shadow-2xl backdrop-blur-xl"
				onCloseAutoFocus={onCloseAutoFocus}
				onEscapeKeyDown={(event) => event.preventDefault()}
				onInteractOutside={(event) => event.preventDefault()}
			>
				<DialogHeader>
					<DialogTitle>{AUTH_COPY.MODAL_TITLE}</DialogTitle>
					<DialogDescription>{AUTH_COPY.MODAL_DESCRIPTION}</DialogDescription>
				</DialogHeader>

				<UsernameForm
					errorMessage={errorMessage}
					isSubmitting={isSubmitting}
					suggestedUsername={suggestedUsername}
					onSubmit={onSubmit}
				/>

				<DialogFooter className="mt-1">
					<DialogClose asChild>
						<Button
							type="button"
							variant="dungeon-outline"
							className="min-h-11 w-full"
							disabled={isSubmitting}
							onClick={onKeepReading}
						>
							{AUTH_COPY.MODAL_KEEP_READING_LABEL}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
