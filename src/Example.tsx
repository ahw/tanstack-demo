import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { DirectorySearchClient } from "./services/DirectorySearchClient";

export function Example() {
  const [userQuery, setUserQuery] = useState("");
  const searchClient = useMemo(() => new DirectorySearchClient(), []);
  const {
    isPending,
    isFetching,
    isLoading,
    isRefetching,
    isStale,
    isSuccess,
    isPaused,
    isError,
    isFetched,
    error,
    data,
  } = useQuery({
    enabled: ({ queryKey }) => queryKey?.[0]?.length > 0,
    queryKey: [userQuery],
    queryFn: async ({ queryKey }) => {
      return searchClient.search(queryKey?.[0]);
    },
  });

  return (
    <div>
      <input
        type="text"
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
      />
      <h1>results</h1>
      <ul style={{ height: 200, overflow: "auto", border: "1px solid black" }}>
        {data?.map((result) => (
          <li key={result}>{result}</li>
        ))}
      </ul>
    </div>
  );
}
