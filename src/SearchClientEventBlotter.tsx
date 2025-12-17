import { useEffect, useRef, useState } from "react";
import type {
  EventCallbackData,
  TextSearchClient,
} from "./services/TextSearchClient";
import { formatNumber } from "./utils/format";

export function SearchClientEventBlotter({
  searchClient,
}: {
  searchClient: TextSearchClient;
}) {
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

  return (
    <div>
      <h1>searchClient events</h1>
      <table className="box box_border">
        <tbody>
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
        </tbody>
      </table>
    </div>
  );
}
