import type { ExampleState } from "./Example";
import { FormGroup } from "./FormGroup";

export function ExampleControls({
  exampleState,
  setExampleState,
}: {
  exampleState: ExampleState;
  setExampleState: React.Dispatch<React.SetStateAction<ExampleState>>;
}) {
  return (
    <div className="px-2 flex items-baseline gap-2">
      <FormGroup>
        <label htmlFor="randomizeDelay" className="mr-4">
          Randomize Delay
        </label>
        <input
          type="checkbox"
          id="randomizeDelay"
          checked={exampleState.randomizeDelay ?? false}
          onChange={(e) =>
            setExampleState((state) => ({
              ...state,
              randomizeDelay: e.target.checked,
            }))
          }
        />
      </FormGroup>

      <FormGroup>
        <label htmlFor="delay" className="mr-2">
          Delay (ms):
        </label>
        <input
          type="number"
          id="delay"
          className="box"
          style={{ width: "5rem", fontFamily: "monospace", padding: "0.25rem" }}
          value={exampleState.delay ?? ""}
          onChange={(e) =>
            setExampleState((state) => ({
              ...state,
              delay: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
        />
      </FormGroup>

      <FormGroup>
        <label htmlFor="errorRate" className="mr-2">
          Error rate
        </label>
        <input
          type="number"
          id="errorRate"
          className="box"
          style={{ width: "5rem", fontFamily: "monospace", padding: "0.25rem" }}
          value={exampleState.errorRate ?? ""}
          onChange={(e) =>
            setExampleState((state) => ({
              ...state,
              errorRate: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
        />
      </FormGroup>
    </div>
  );
}
