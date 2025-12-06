import EventEmitter from "eventemitter3";

interface Events {
  query: (query: string) => void;
  searchCompleted: (results: string[]) => void;
  searchFailed: (error: Error) => void;
}

export class DirectorySearchClient extends EventEmitter<Events> {
  entries: string[];
  constructor() {
    super();
    this.entries = [
      "apple",
      "banana",
      "cherry",
      "date",
      "elderberry",
      "fig",
      "grape",
      "honeydew",
    ];
  }

  async search(query: string): Promise<string[]> {
    this.emit("query", query);
    try {
      // Simulate an asynchronous search operation
      const results = await new Promise<string[]>((resolve) => {
        setTimeout(() => {
          resolve(this.entries.filter((entry) => entry.includes(query)));
        }, 500);
      });

      this.emit("searchCompleted", results);
      return results;
    } catch (error) {
      this.emit("searchFailed", error as Error);
      throw error;
    }
  }
}
