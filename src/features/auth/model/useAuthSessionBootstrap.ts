import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { v4 as createUuid } from "uuid";

import { userQueries } from "@/entities/user";

import {
	ensureSessionUuid,
	getAuthClientStorage,
	resolveSessionBootstrapEvent,
} from "../lib";

import type { AuthMachineEvent } from "./types";

type UseAuthSessionBootstrapInput = {
	sendAuthEvent: (event: AuthMachineEvent) => void;
};

type UseAuthSessionBootstrapResult = {
	sessionUuid: string | null;
};

export const useAuthSessionBootstrap = ({
	sendAuthEvent,
}: UseAuthSessionBootstrapInput): UseAuthSessionBootstrapResult => {
	const [sessionUuid, setSessionUuid] = useState<string | null>(null);

	useEffect(() => {
		const storage = getAuthClientStorage();

		if (!storage) {
			return;
		}

		setSessionUuid(ensureSessionUuid(storage, createUuid));
	}, []);

	const profileQuery = useQuery({
		...userQueries.byUuid(sessionUuid ?? ""),
		enabled: Boolean(sessionUuid),
	});

	useEffect(() => {
		const sessionBootstrapEvent = resolveSessionBootstrapEvent({
			sessionUuid,
			isProfileQueryPending: profileQuery.isPending,
			profile: profileQuery.data,
		});

		if (!sessionBootstrapEvent) {
			return;
		}

		sendAuthEvent(sessionBootstrapEvent);
	}, [sessionUuid, profileQuery.data, profileQuery.isPending, sendAuthEvent]);

	return { sessionUuid };
};
