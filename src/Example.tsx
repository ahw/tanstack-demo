import { useQuery, type QueryFunction } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AMERICAN_CITIES } from "./data/AMERICAN_CITIES";
import { ExampleControls } from "./ExampleControls";
import {
  TextSearchClient,
  type EventCallbackData,
} from "./services/TextSearchClient";
import { formatNumber } from "./utils/format";

export interface ExampleState {
  delay?: number;
  randomizeDelay?: boolean;
}

export function Example() {
  const [exampleState, setExampleState] = useState<ExampleState>({
    randomizeDelay: false,
    delay: 300,
  });

  const [userQuery, setUserQuery] = useState("");
  const searchClient = useMemo(
    () =>
      new TextSearchClient(AMERICAN_CITIES, {
        randomizeDelay: exampleState.randomizeDelay,
        delay: exampleState.delay,
      }),
    [exampleState.delay, exampleState.randomizeDelay]
  );
  const search: QueryFunction<string[], string[]> = useCallback(
    ({ queryKey }) => {
      return searchClient.search(queryKey?.[0]);
    },
    [searchClient]
  );

  const t0 = useRef<number | undefined>(undefined);
  const [searchClientEvents, setSearchClientEvents] = useState<
    { time: number; data: string }[]
  >([]);

  useEffect(() => {
    const eventHandler = (data: EventCallbackData) => {
      t0.current ??= Date.now();
      setSearchClientEvents((events) => [
        ...events,
        {
          time: Date.now(),
          data: data.eventName + ": " + data.data.join(", "),
        },
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
    <div>
      <ExampleControls
        exampleState={exampleState}
        setExampleState={setExampleState}
      />
      <hr className="my-4 border-t-0 border-b border-dashed border-black" />

      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <h1>Search</h1>
          <input
            type="text"
            className="box"
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
            className="box box_border"
            style={{ height: 200, overflow: "auto" }}
          >
            {data?.map((result) => (
              <code style={{ display: "block" }} key={result}>
                {result}
              </code>
            ))}
          </div>
        </div>
        <div>
          <h1>useQuery states</h1>
          <table className="box box_border">
            {stateItems.map(([key, value]) => (
              <tr className="border-b border-solid border-black" key={key}>
                <td className="px-1">{key}</td>
                <td
                  className="px-1"
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
          <h1>searchClient events</h1>
          <table className="box box_border">
            {searchClientEvents.map((event, index) => (
              <tr key={index} style={{ fontFamily: "monospace" }}>
                <td className="px-1 text-gray-500">
                  {formatNumber((event.time - (t0.current ?? 0)) / 1000, {
                    maximumFractionDigits: 3,
                    minimumFractionDigits: 3,
                  })}
                </td>
                <td className="px-1">{event.data}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}
