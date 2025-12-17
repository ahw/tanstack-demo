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

interface PreprocessedEntry<T = unknown> {
  original: string;
  lowercased: string;
  data?: T;
}

interface TextSearchClientOptions {
  delay?: number;
  randomizeDelay?: boolean;
  slowDownRate?: number;
  errorRate?: number;
}

export class TextSearchClient<T = unknown> extends EventEmitter<Events> {
  records: PreprocessedEntry<T>[];
  options: TextSearchClientOptions | undefined;

  constructor(
    records?: { key: string; data: T }[],
    options?: TextSearchClientOptions
  ) {
    super();
    this.options = options;
    if (records) {
      this.records = records.map((record) => ({
        original: record.key,
        lowercased: record.key.toLowerCase(),
        data: record.data,
      }));
    } else {
      this.records = [];
    }
  }

  setOptions(options: Partial<TextSearchClientOptions>) {
    this.options = { ...this.options, ...options };
  }

  async search(query: string): Promise<{ key: string; data?: T }[]> {
    this.emit("query", { eventName: "query", data: [query] });
    try {
      // Simulate an asynchronous search operation
      const errorRate = this.options?.errorRate ?? 0;
      const slowDownRate = this.options?.slowDownRate ?? 1;
      const delay = this.options?.delay ?? 300;
      const randomFactor = this.options?.randomizeDelay ? Math.random() : 1;
      const results = await new Promise<{ key: string; data?: T }[]>(
        (resolve, reject) => {
          setTimeout(() => {
            if (Math.random() < errorRate) {
              reject(new Error(`Search for "${query}" failed`));
            } else {
              resolve(
                this.records
                  .filter((record) => record.lowercased.includes(query))
                  .map((record) => ({
                    key: record.original,
                    data: record.data,
                  }))
              );
            }
          }, Math.floor(slowDownRate * delay * randomFactor));
        }
      );

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
