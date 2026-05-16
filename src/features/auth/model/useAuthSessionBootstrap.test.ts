// @vitest-environment happy-dom

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { UserProfile } from "@/entities/user";

import {
	AUTH_BOOTSTRAP_TIMEOUT_MS,
	AUTH_ERROR_MESSAGES,
	AUTH_EVENTS,
} from "../config";

const TEST_USER_PROFILE: UserProfile = {
	id: "user-1",
	uuid: "uuid-1",
	username: "runestone_hero",
	discriminator: "0001",
	createdAt: 1,
	updatedAt: 1,
};

const {
	mockSendAuthEvent,
	mockUseQuery,
	mockRefetch,
	mockUserQueriesByUuid,
	mockGetAuthClientStorage,
} = vi.hoisted(() => ({
	mockSendAuthEvent: vi.fn(),
	mockUseQuery: vi.fn(),
	mockRefetch: vi.fn(),
	mockUserQueriesByUuid: vi.fn((uuid: string) => ({
		queryKey: ["user", uuid],
		queryFn: vi.fn(),
	})),
	mockGetAuthClientStorage: vi.fn(),
}));

const createMemoryStorage = (): Storage =>
	({
		getItem: vi.fn((key: string) =>
			key === "rs_uuid" ? "existing-session-uuid" : null,
		),
		setItem: vi.fn(),
		removeItem: vi.fn(),
	}) as unknown as Storage;

vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();

	return {
		...actual,
		useQuery: mockUseQuery,
	};
});

vi.mock("@/entities/user", async () => {
	const actual =
		await vi.importActual<typeof import("@/entities/user")>("@/entities/user");

	return {
		...actual,
		userQueries: {
			...actual.userQueries,
			byUuid: mockUserQueriesByUuid,
		},
	};
});

vi.mock("../lib", async () => {
	const actual = await vi.importActual<typeof import("../lib")>("../lib");

	return {
		...actual,
		getAuthClientStorage: mockGetAuthClientStorage,
	};
});

import { useAuthSessionBootstrap } from "./useAuthSessionBootstrap";

describe("useAuthSessionBootstrap", () => {
	beforeEach(() => {
		const memoryStorage = createMemoryStorage();

		mockSendAuthEvent.mockReset();
		mockUseQuery.mockReturnValue({
			data: TEST_USER_PROFILE,
			isPending: false,
			isError: false,
			error: null,
			refetch: mockRefetch,
		});
		mockGetAuthClientStorage.mockReturnValue(memoryStorage);
		mockRefetch.mockReset();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it("hydrates the session uuid and dispatches the bootstrap event when the query is ready", async () => {
		const { result } = renderHook(() =>
			useAuthSessionBootstrap({
				sendAuthEvent: mockSendAuthEvent,
			}),
		);

		await waitFor(() => {
			expect(result.current.sessionUuid).toBe("existing-session-uuid");
		});

		expect(mockUserQueriesByUuid).toHaveBeenCalledWith("existing-session-uuid");
		expect(mockSendAuthEvent).toHaveBeenCalledWith({
			type: AUTH_EVENTS.SESSION_BOOTSTRAPPED,
			uuid: "existing-session-uuid",
			profile: TEST_USER_PROFILE,
		});
	});

	it("dispatches a bootstrap failure event when the profile query errors before returning a profile", async () => {
		mockUseQuery.mockReturnValue({
			data: undefined,
			isPending: false,
			isError: true,
			error: new Error("Convex unreachable"),
			refetch: mockRefetch,
		});

		renderHook(() =>
			useAuthSessionBootstrap({
				sendAuthEvent: mockSendAuthEvent,
			}),
		);

		await waitFor(() => {
			expect(mockSendAuthEvent).toHaveBeenCalledWith({
				type: AUTH_EVENTS.SESSION_BOOTSTRAP_FAILED,
				uuid: "existing-session-uuid",
				errorMessage: "Convex unreachable",
			});
		});
	});

	it("dispatches a bootstrap failure event when the profile query times out before returning a profile", async () => {
		vi.useFakeTimers();
		mockUseQuery.mockReturnValue({
			data: undefined,
			isPending: true,
			isError: false,
			error: null,
			refetch: mockRefetch,
		});

		const { result } = renderHook(() =>
			useAuthSessionBootstrap({
				sendAuthEvent: mockSendAuthEvent,
			}),
		);

		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.sessionUuid).toBe("existing-session-uuid");

		act(() => {
			vi.advanceTimersByTime(AUTH_BOOTSTRAP_TIMEOUT_MS);
		});

		expect(mockSendAuthEvent).toHaveBeenCalledWith({
			type: AUTH_EVENTS.SESSION_BOOTSTRAP_FAILED,
			uuid: "existing-session-uuid",
			errorMessage: AUTH_ERROR_MESSAGES.SESSION_BOOTSTRAP_TIMED_OUT,
		});
		vi.clearAllTimers();
	});

	it("dispatches a retry event and re-runs the bootstrap query when retry is requested", async () => {
		vi.useFakeTimers();
		mockUseQuery.mockReturnValue({
			data: undefined,
			isPending: true,
			isError: false,
			error: null,
			refetch: mockRefetch,
		});

		const { result } = renderHook(() =>
			useAuthSessionBootstrap({
				sendAuthEvent: mockSendAuthEvent,
			}),
		);

		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.sessionUuid).toBe("existing-session-uuid");

		act(() => {
			result.current.handleSessionBootstrapRetry();
		});

		expect(mockSendAuthEvent).toHaveBeenCalledWith({
			type: AUTH_EVENTS.SESSION_BOOTSTRAP_RETRY_REQUESTED,
		});
		expect(mockRefetch).toHaveBeenCalledOnce();

		vi.clearAllTimers();
	});
});
