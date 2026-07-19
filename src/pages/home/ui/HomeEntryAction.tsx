import { ClientOnly } from "@tanstack/react-router";

import { AUTH_STATUS } from "@/features/auth";

import type { HomeEntryActionContentProps } from "./HomeEntryActionContent";
import { HomeEntryActionContent } from "./HomeEntryActionContent";
import { HomeEntryActionSkeleton } from "./HomeEntryActionSkeleton";

type HomeEntryActionProps = HomeEntryActionContentProps;

export function HomeEntryAction(props: HomeEntryActionProps) {
	const fallback = <HomeEntryActionSkeleton label={props.label} />;

	return (
		<ClientOnly fallback={fallback}>
			{props.authStatus === AUTH_STATUS.CHECKING_SESSION ? (
				fallback
			) : (
				<HomeEntryActionContent {...props} />
			)}
		</ClientOnly>
	);
}
