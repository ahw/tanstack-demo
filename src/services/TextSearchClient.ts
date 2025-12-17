import EventEmitter from "eventemitter3";

export interface EventCallbackData {
  eventName: string;
  data: string[];
}
interface Events {
  query: (data: EventCallbackData) => void;
  searchCompleted: (data: EventCallbackData) => void;
  searchFailed: (data: EventCallbackData) => void;
}

interface PreprocessedEntry {
  original: string;
  lowercased: string;
}

interface TextSearchClientOptions {
  delay?: number;
  randomizeDelay?: boolean;
  slowDownRate?: number;
  errorRate?: number;
}

export class TextSearchClient extends EventEmitter<Events> {
  entries: PreprocessedEntry[];
  options: TextSearchClientOptions | undefined;

  constructor(entries?: string[], options?: TextSearchClientOptions) {
    super();
    this.options = options;
    if (entries) {
      this.entries = Array.from(new Set(entries)).map((entry) => ({
        original: entry,
        lowercased: entry.toLowerCase(),
      }));
    } else {
      this.entries = [
        { original: "apple", lowercased: "apple" },
        { original: "banana", lowercased: "banana" },
      ];
    }
  }

  setOptions(options: Partial<TextSearchClientOptions>) {
    this.options = { ...this.options, ...options };
  }

  async search(query: string): Promise<string[]> {
    this.emit("query", { eventName: "query", data: [query] });
    try {
      // Simulate an asynchronous search operation
      const errorRate = this.options?.errorRate ?? 0;
      const slowDownRate = this.options?.slowDownRate ?? 1;
      const delay = this.options?.delay ?? 300;
      const randomFactor = this.options?.randomizeDelay ? Math.random() : 1;
      const results = await new Promise<string[]>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < errorRate) {
            reject(new Error(`Search for "${query}" failed`));
          } else {
            resolve(
              this.entries
                .filter((entry) => entry.lowercased.includes(query))
                .map((entry) => entry.original)
            );
          }
        }, Math.floor(slowDownRate * delay * randomFactor));
      });

      this.emit("searchCompleted", {
        eventName: "searchCompleted",
        data: [query, `${results.length} results`],
      });
      return results;
    } catch (error) {
      this.emit("searchFailed", { eventName: "searchFailed", data: [] });
      throw error;
    }
  }
}
