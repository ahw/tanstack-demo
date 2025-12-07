import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Example } from "./Example";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="p-2">
      <QueryClientProvider client={queryClient}>
        <Example />
      </QueryClientProvider>
    </div>
  );
}

export default App;
