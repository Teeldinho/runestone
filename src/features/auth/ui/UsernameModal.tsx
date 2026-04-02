import {
	Dialog,
	DialogContent,
	DialogDescription,
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
	onSubmit: (input: UsernameFormInput) => Promise<void>;
};

export function UsernameModal({
	errorMessage,
	isOpen,
	isSubmitting,
	onSubmit,
}: UsernameModalProps) {
	return (
		<Dialog open={isOpen}>
			<DialogContent
				showCloseButton={false}
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
					onSubmit={onSubmit}
				/>
			</DialogContent>
		</Dialog>
	);
}
