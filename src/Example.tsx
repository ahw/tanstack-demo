import { useQuery, type QueryFunction } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AMERICAN_CITIES } from "./data/AMERICAN_CITIES";
import { ExampleControls } from "./ExampleControls";
import { SearchClientEventBlotter } from "./SearchClientEventBlotter";
import { TextSearchClient } from "./services/TextSearchClient";

export interface ExampleState {
  delay?: number;
  randomizeDelay?: boolean;
  errorRate?: number;
}

export function Example() {
  const [exampleState, setExampleState] = useState<ExampleState>({
    randomizeDelay: false,
    delay: 300,
    errorRate: 0.1,
  });

  const [userQuery, setUserQuery] = useState("");
  const searchClient = useMemo(
    () =>
      new TextSearchClient(
        AMERICAN_CITIES.map((city) => ({
          key: city,
          data: {
            population: Math.floor(Math.random() * 1000000),
          },
        }))
      ),
    []
  );

  useEffect(() => {
    searchClient.setOptions({
      delay: exampleState.delay,
      randomizeDelay: exampleState.randomizeDelay,
      errorRate: exampleState.errorRate,
    });
  }, [exampleState, searchClient]);

  const search: QueryFunction<{ key: string; data?: unknown }[], string[]> =
    useCallback(
      ({ queryKey }) => {
        return searchClient.search(queryKey?.[0]);
      },
      [searchClient]
    );

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
    retry: 10,
    retryDelay: 1000,
  });

  const statesToDisplay = {
    status,
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
    error,
    failureCount,
    failureReason,
  };

  const stateItems = useMemo(() => {
    return Array.from(Object.entries(statesToDisplay));
  }, [statesToDisplay]);

  const stateDescriptions: Record<string, string> = {
    status: `QueryStatus`,
    // pending = there's no cached data and no query attempt was finished yet.
    // error = the query attempt resulted in an error. The corresponding error property has the error received from the attempted fetch.
    // success = the query has received a response with no errors and is ready to display its data. The corresponding data property on the query is the data received from the successful fetch or if the query's enabled property is set to false and has not been fetched yet data is the first initialData supplied to the query on initialization.`,
    isPending: `Derived boolean from "status"`,
    isSuccess: `Derived boolean from "status"`,
    isError: `Derived boolean from "status"`,
    isLoadingError: `True if query failed while fetching for the first time.`,
    isRefetchError: `True if query failed while refetching.`,
    data: `The last successfully resolved data for the query`,
    dataUpdatedAt: `Timestamp for "success" status`,
    error: `Error object for query, if error was thrown`,
    errorUpdatedAt: `Timestamp for most recent "error" status`,
    isStale: `True if the data in the cache is invalidated or if data is older than the given staleTime.`,
    isPlaceholderData: `True if data shown is the placeholder data.`,
    isFetched: `True if query has been fetched`,
    isFetchedAfterMount: `True if query has been fetched after the component mounted. This property can be used to not show any previously cached data.`,
    fetchStatus: `FetchStatus: fetching=true whenever queryFn is executing; paused=true The query wanted to fetch, but has been paused. idle=true The query is not fetching. see Network Mode for more information.`,
    isFetching: `Derived boolean from "fetchStatus"`,
    isPaused: `Derived boolean from "fetchStatus"`,
    isRefetching: `Is true whenever a background refetch is in-flight, which does not include initial pending.  Is the same as isFetching && !isPending`,
    isLoading: `Is true whenever the first fetch for a query is in-flight. Is the same as isFetching && isPending`,
    isInitialLoading: `deprecated - An alias for isLoading, will be removed in the next major version.`,
    isEnabled: `Is true if this query observer is enabled, false otherwise.`,
    failureCount: `Failure count. Incremented when query fails. Reset when query succeeds.`,
    failureReason: `Failure reason for the query retry. Reset to when query succeeds.`,
    errorUpdateCount: `The sum of all errors.`,
  };

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
              <code style={{ display: "block" }} key={result.key}>
                {result.key} - {JSON.stringify(result.data)}
              </code>
            ))}
          </div>
        </div>

        <div>
          <h1>useQuery states</h1>
          <table className="box box_border" style={{ width: 600 }}>
            <thead>
              <tr className="border-b border-solid border-black">
                <th className="px-1 text-left">State</th>
                <th className="px-1 text-left">Value</th>
                <th className="px-1 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {stateItems.map(([key, value]) => (
                <tr className="border-b border-solid border-black" key={key}>
                  <td className="px-1" style={{ verticalAlign: "top" }}>
                    {key}
                  </td>
                  <td
                    className="px-1"
                    style={{
                      backgroundColor:
                        typeof value === "boolean"
                          ? value
                            ? "lightgreen"
                            : "lightcoral"
                          : "transparent",
                      verticalAlign: "top",
                      whiteSpace: "pre-wrap",
                      width: 80,
                    }}
                  >
                    {String(value)}
                  </td>
                  <td className="px-1" style={{ verticalAlign: "top" }}>
                    {stateDescriptions[key] ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SearchClientEventBlotter searchClient={searchClient} />
      </div>
    </div>
  );
}
