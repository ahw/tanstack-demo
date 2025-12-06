import { useQuery, type QueryFunction } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DirectorySearchClient,
  type EventCallbackData,
} from "./services/DirectorySearchClient";

export function Example() {
  const [userQuery, setUserQuery] = useState("");
  const searchClient = useMemo(() => new DirectorySearchClient(), []);
  const search: QueryFunction<string[], string[]> = useCallback(
    ({ queryKey }) => {
      return searchClient.search(queryKey?.[0]);
    },
    [searchClient]
  );

  const [searchClientEvents, setSearchClientEvents] = useState<string[]>([]);

  useEffect(() => {
    const eventHandler = (data: EventCallbackData) => {
      setSearchClientEvents((events) => [
        ...events,
        data.eventName + ": " + data.data.join(", "),
      ]);
    };

    searchClient.addListener("query", eventHandler);
    searchClient.addListener("searchCompleted", eventHandler);
    searchClient.addListener("searchFailed", eventHandler);

    return () => {
      searchClient.removeListener("query", eventHandler);
      searchClient.removeListener("searchCompleted", eventHandler);
      searchClient.removeListener("searchFailed", eventHandler);
    };
  }, [searchClient]);

  const {
    data,
    status,
    error,
    failureCount,
    failureReason,
    fetchStatus,
    isEnabled,
    isError,
    isFetched,
    isFetchedAfterMount,
    isFetching,
    isLoading,
    isLoadingError,
    isPaused,
    isPending,
    isPlaceholderData,
    isRefetchError,
    isRefetching,
    isStale,
    isSuccess,
  } = useQuery({
    queryKey: [userQuery],
    enabled: ({ queryKey }) => queryKey?.[0]?.length > 0,
    queryFn: search,
  });

  const statesToDisplay = {
    status,
    fetchStatus,
    error,
    failureCount,
    failureReason,
    isEnabled,
    isError,
    isFetched,
    isFetchedAfterMount,
    isFetching,
    isLoading,
    isLoadingError,
    isPaused,
    isPending,
    isPlaceholderData,
    isRefetchError,
    isRefetching,
    isStale,
    isSuccess,
  };

  const stateItems = useMemo(() => {
    return Array.from(Object.entries(statesToDisplay));
  }, [statesToDisplay]);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div>
        <h1>Search</h1>
        <input
          type="text"
          style={{
            width: "100%",
            marginBottom: "1rem",
            border: "1px solid black",
            fontFamily: "monospace",
          }}
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
        />
        <h1>Results</h1>
        <div
          style={{ height: 200, overflow: "auto", border: "1px dashed black" }}
        >
          {data?.map((result) => (
            <code style={{ display: "block" }} key={result}>
              {result}
            </code>
          ))}
        </div>
      </div>
      <div>
        <h1>React Query States</h1>
        <table style={{ border: "1px dashed black" }}>
          {stateItems.map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td
                style={{
                  backgroundColor:
                    typeof value === "boolean"
                      ? value
                        ? "lightgreen"
                        : "lightcoral"
                      : "transparent",
                }}
              >
                {String(value)}
              </td>
            </tr>
          ))}
        </table>
      </div>

      <div>
        <h1>DirectorySearchClient events</h1>
        <div>
          {searchClientEvents.map((event, index) => (
            <div key={index} style={{ fontFamily: "monospace" }}>
              {event}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
