import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { v4 as createUuid } from "uuid";

import { userQueries } from "@/entities/user";

import { AUTH_BOOTSTRAP_TIMEOUT_MS, AUTH_EVENTS } from "../config";
import {
	ensureSessionUuid,
	getAuthClientStorage,
	resolveSessionBootstrapEvent,
	resolveSessionBootstrapFailureEvent,
} from "../lib";

import type { AuthMachineEvent } from "./types";

type UseAuthSessionBootstrapInput = {
	sendAuthEvent: (event: AuthMachineEvent) => void;
};

type UseAuthSessionBootstrapResult = {
	sessionUuid: string | null;
	handleSessionBootstrapRetry: () => void;
};

export const useAuthSessionBootstrap = ({
	sendAuthEvent,
}: UseAuthSessionBootstrapInput): UseAuthSessionBootstrapResult => {
	const [sessionUuid, setSessionUuid] = useState<string | null>(null);
	const [hasSessionBootstrapTimedOut, setHasSessionBootstrapTimedOut] =
		useState(false);

	useEffect(() => {
		const storage = getAuthClientStorage();

		if (!storage) {
			return;
		}

		setSessionUuid(ensureSessionUuid(storage, createUuid));
	}, []);

	const profileQueryOptions = userQueries.byUuid(sessionUuid ?? "");
	const profileQuery = useQuery({
		...profileQueryOptions,
		enabled: Boolean(sessionUuid),
	});

	useEffect(() => {
		if (
			!sessionUuid ||
			!profileQuery.isPending ||
			hasSessionBootstrapTimedOut
		) {
			if (!sessionUuid || !profileQuery.isPending) {
				setHasSessionBootstrapTimedOut(false);
			}

			return;
		}

		setHasSessionBootstrapTimedOut(false);

		const timeoutId = setTimeout(() => {
			setHasSessionBootstrapTimedOut(true);
		}, AUTH_BOOTSTRAP_TIMEOUT_MS);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [hasSessionBootstrapTimedOut, profileQuery.isPending, sessionUuid]);

	const handleSessionBootstrapRetry = useCallback(() => {
		if (!sessionUuid) {
			return;
		}

		setHasSessionBootstrapTimedOut(false);
		sendAuthEvent({
			type: AUTH_EVENTS.SESSION_BOOTSTRAP_RETRY_REQUESTED,
		});
		void profileQuery.refetch();
	}, [profileQuery.refetch, sendAuthEvent, sessionUuid]);

	useEffect(() => {
		const sessionBootstrapFailureEvent = resolveSessionBootstrapFailureEvent({
			sessionUuid,
			isProfileQueryPending: profileQuery.isPending,
			isProfileQueryError: profileQuery.isError,
			hasSessionBootstrapTimedOut,
			profile: profileQuery.data,
			error: profileQuery.error,
		});

		if (sessionBootstrapFailureEvent) {
			sendAuthEvent(sessionBootstrapFailureEvent);
			return;
		}

		const sessionBootstrapEvent = resolveSessionBootstrapEvent({
			sessionUuid,
			isProfileQueryPending: profileQuery.isPending,
			profile: profileQuery.data,
		});

		if (!sessionBootstrapEvent) {
			return;
		}

		sendAuthEvent(sessionBootstrapEvent);
	}, [
		profileQuery.data,
		profileQuery.error,
		profileQuery.isError,
		profileQuery.isPending,
		sendAuthEvent,
		sessionUuid,
		hasSessionBootstrapTimedOut,
	]);

	return { sessionUuid, handleSessionBootstrapRetry };
};
