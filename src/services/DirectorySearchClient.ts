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

export class DirectorySearchClient extends EventEmitter<Events> {
  entries: string[];
  constructor() {
    super();
    this.entries = [
      "apple",
      "banana",
      "blackberry",
      "blueberry",
      "cantaloupe",
      "cherry",
      "currant",
      "date plum",
      "date",
      "dragonfruit",
      "elderberry",
      "elderflower",
      "feijoa",
      "fig",
      "grape",
      "honeydew",
      "jackfruit",
      "kiwi",
      "lemon",
      "lychee",
      "mango",
      "mulberry",
      "nectarine",
      "orange",
      "papaya",
      "persimmon",
      "pineapple",
      "pomegranate",
      "quince",
      "raspberry",
      "starfruit",
      "strawberry",
      "tamarind",
      "tangerine",
      "ugli fruit",
      "voavanga",
      "watermelon",
      "xigua",
      "yellow passion fruit",
      "zucchini",
    ];
  }

  async search(query: string): Promise<string[]> {
    this.emit("query", { eventName: "query", data: [query] });
    try {
      // Simulate an asynchronous search operation
      const results = await new Promise<string[]>((resolve) => {
        setTimeout(() => {
          resolve(this.entries.filter((entry) => entry.includes(query)));
        }, 500);
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

  async listAll(): Promise<string[]> {
    return this.entries;
  }
}
