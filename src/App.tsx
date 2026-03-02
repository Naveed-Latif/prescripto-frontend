import { BrowserRouter } from "react-router-dom";
import AppLayout from "./Layout/AppLayout";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
